/**
 * Hook para consulta de CEP usando ViaCEP API
 * https://viacep.com.br/
 */

import { useState, useCallback } from 'react';
import { onlyNumbers } from '@/utils/masks';

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  ibge: string;
  ddd: string;
}

export interface UseCEPReturn {
  loading: boolean;
  error: string | null;
  address: AddressData | null;
  fetchAddress: (cep: string) => Promise<AddressData | null>;
  clearAddress: () => void;
}

export function useCEP(): UseCEPReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);

  const fetchAddress = useCallback(async (cep: string): Promise<AddressData | null> => {
    const cleanCEP = onlyNumbers(cep);
    
    if (cleanCEP.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        setAddress(null);
        return null;
      }

      const addressData: AddressData = {
        cep: data.cep,
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        ibge: data.ibge,
        ddd: data.ddd,
      };

      setAddress(addressData);
      return addressData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar CEP';
      setError(message);
      setAddress(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAddress = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    address,
    fetchAddress,
    clearAddress,
  };
}

export default useCEP;
