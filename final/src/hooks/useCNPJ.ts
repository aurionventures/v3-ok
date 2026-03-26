/**
 * Hook para consulta de CNPJ usando BrasilAPI
 * https://brasilapi.com.br/docs#tag/CNPJ
 */

import { useState, useCallback } from 'react';
import { onlyNumbers, isValidCNPJ } from '@/utils/masks';

export interface BrasilAPICNPJResponse {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string | null;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  ddd_fax: string;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: boolean;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
  qsa: Array<{
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string | null;
    nome_representante_legal: string | null;
    codigo_qualificacao_representante_legal: number | null;
  }>;
}

export interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  dataAbertura: string;
  naturezaJuridica: number;
  atividadePrincipal: {
    codigo: number;
    descricao: string;
  };
  atividadesSecundarias: Array<{
    codigo: number;
    descricao: string;
  }>;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
  };
  telefone1: string;
  telefone2: string;
  capitalSocial: number;
  porte: string;
  optanteSimples: boolean;
  optanteMEI: boolean;
  socios: Array<{
    nome: string;
    cpfCnpj: string;
    qualificacao: number;
    percentual: number;
    dataEntrada: string;
  }>;
  isMatriz: boolean;
}

export interface UseCNPJReturn {
  loading: boolean;
  error: string | null;
  company: CompanyData | null;
  fetchCompany: (cnpj: string) => Promise<CompanyData | null>;
  clearCompany: () => void;
}

export function useCNPJ(): UseCNPJReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);

  const fetchCompany = useCallback(async (cnpj: string): Promise<CompanyData | null> => {
    const cleanCNPJ = onlyNumbers(cnpj);
    
    if (cleanCNPJ.length !== 14) {
      setError('CNPJ deve ter 14 dígitos');
      return null;
    }

    if (!isValidCNPJ(cleanCNPJ)) {
      setError('CNPJ inválido');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
      
      if (response.status === 404) {
        setError('CNPJ não encontrado na base da Receita Federal');
        setCompany(null);
        return null;
      }

      if (!response.ok) {
        throw new Error('Erro ao consultar CNPJ');
      }

      const data: BrasilAPICNPJResponse = await response.json();

      const companyData: CompanyData = {
        cnpj: data.cnpj,
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia || data.razao_social,
        situacao: data.descricao_situacao_cadastral,
        dataAbertura: data.data_inicio_atividade,
        naturezaJuridica: data.codigo_natureza_juridica,
        atividadePrincipal: {
          codigo: data.cnae_fiscal,
          descricao: data.cnae_fiscal_descricao,
        },
        atividadesSecundarias: data.cnaes_secundarios || [],
        endereco: {
          logradouro: `${data.descricao_tipo_logradouro} ${data.logradouro}`.trim(),
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cep: data.cep,
          cidade: data.municipio,
          uf: data.uf,
        },
        telefone1: data.ddd_telefone_1,
        telefone2: data.ddd_telefone_2,
        capitalSocial: data.capital_social,
        porte: data.descricao_porte,
        optanteSimples: data.opcao_pelo_simples,
        optanteMEI: data.opcao_pelo_mei,
        socios: (data.qsa || []).map(socio => ({
          nome: socio.nome_socio,
          cpfCnpj: socio.cnpj_cpf_do_socio,
          qualificacao: socio.codigo_qualificacao_socio,
          percentual: socio.percentual_capital_social,
          dataEntrada: socio.data_entrada_sociedade,
        })),
        isMatriz: data.identificador_matriz_filial === 1,
      };

      setCompany(companyData);
      return companyData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar CNPJ';
      setError(message);
      setCompany(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCompany = useCallback(() => {
    setCompany(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    company,
    fetchCompany,
    clearCompany,
  };
}

export default useCNPJ;
