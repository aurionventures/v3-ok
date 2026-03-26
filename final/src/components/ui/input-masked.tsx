/**
 * Componentes de Input com Máscara e Auto-preenchimento
 * InputCEP, InputCNPJ, InputPhone, InputCurrency, InputDate
 */

import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Search, CheckCircle, AlertCircle, MapPin, Building2, Phone, DollarSign, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCEP, type AddressData } from '@/hooks/useCEP';
import { useCNPJ, type CompanyData } from '@/hooks/useCNPJ';
import {
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatCellphone,
  formatCurrencyInput,
  formatDate,
  isValidCEP,
  isValidCNPJ,
  isValidCPF,
  isValidPhone,
  isValidDate,
  onlyNumbers,
  parseCurrency,
} from '@/utils/masks';

// ==========================================
// TIPOS COMUNS
// ==========================================

interface BaseInputProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

// ==========================================
// INPUT CEP
// ==========================================

interface InputCEPProps extends BaseInputProps {
  value: string;
  onChange: (value: string, address?: AddressData | null) => void;
  onAddressLoaded?: (address: AddressData) => void;
  autoFetch?: boolean;
  showSearchButton?: boolean;
}

export const InputCEP = forwardRef<HTMLInputElement, InputCEPProps>(({
  id = 'cep',
  label = 'CEP',
  value,
  onChange,
  onAddressLoaded,
  autoFetch = true,
  showSearchButton = true,
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const { loading, error: fetchError, address, fetchAddress } = useCEP();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange(formatted);
    setLocalError(null);
  }, [onChange]);

  const handleSearch = useCallback(async () => {
    const cleanCEP = onlyNumbers(value);
    if (cleanCEP.length === 8) {
      const result = await fetchAddress(value);
      if (result && onAddressLoaded) {
        onAddressLoaded(result);
        onChange(value, result);
      }
    } else {
      setLocalError('CEP deve ter 8 dígitos');
    }
  }, [value, fetchAddress, onAddressLoaded, onChange]);

  // Auto-fetch quando CEP completo
  useEffect(() => {
    const cleanCEP = onlyNumbers(value);
    if (autoFetch && cleanCEP.length === 8 && !address) {
      handleSearch();
    }
  }, [value, autoFetch, handleSearch, address]);

  const displayError = error || localError || fetchError;
  const isValid = isValidCEP(value) && address && !displayError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={ref}
            id={id}
            value={value}
            onChange={handleChange}
            placeholder="00000-000"
            maxLength={9}
            disabled={disabled || loading}
            className={cn(
              inputClassName,
              isValid && "border-green-500 focus-visible:ring-green-500",
              displayError && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
        {showSearchButton && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSearch}
            disabled={disabled || loading || onlyNumbers(value).length !== 8}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
      {isValid && address && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {address.street}, {address.neighborhood} - {address.city}/{address.state}
        </p>
      )}
    </div>
  );
});

InputCEP.displayName = 'InputCEP';

// ==========================================
// INPUT CNPJ
// ==========================================

interface InputCNPJProps extends BaseInputProps {
  value: string;
  onChange: (value: string, company?: CompanyData | null) => void;
  onCompanyLoaded?: (company: CompanyData) => void;
  autoFetch?: boolean;
  showSearchButton?: boolean;
  showCompanyPreview?: boolean;
}

export const InputCNPJ = forwardRef<HTMLInputElement, InputCNPJProps>(({
  id = 'cnpj',
  label = 'CNPJ',
  value,
  onChange,
  onCompanyLoaded,
  autoFetch = true,
  showSearchButton = true,
  showCompanyPreview = true,
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const { loading, error: fetchError, company, fetchCompany, clearCompany } = useCNPJ();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    onChange(formatted);
    setLocalError(null);
    // Limpa dados anteriores quando o CNPJ muda
    if (company) clearCompany();
  }, [onChange, company, clearCompany]);

  const handleSearch = useCallback(async () => {
    const cleanCNPJ = onlyNumbers(value);
    if (cleanCNPJ.length === 14) {
      if (!isValidCNPJ(value)) {
        setLocalError('CNPJ inválido (dígitos verificadores incorretos)');
        return;
      }
      const result = await fetchCompany(value);
      if (result && onCompanyLoaded) {
        onCompanyLoaded(result);
        onChange(value, result);
      }
    } else {
      setLocalError('CNPJ deve ter 14 dígitos');
    }
  }, [value, fetchCompany, onCompanyLoaded, onChange]);

  // Auto-fetch quando CNPJ completo
  useEffect(() => {
    const cleanCNPJ = onlyNumbers(value);
    if (autoFetch && cleanCNPJ.length === 14 && !company) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce para evitar chamadas excessivas
      return () => clearTimeout(timer);
    }
  }, [value, autoFetch, handleSearch, company]);

  const displayError = error || localError || fetchError;
  const isValid = isValidCNPJ(value) && company && !displayError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={ref}
            id={id}
            value={value}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            disabled={disabled || loading}
            className={cn(
              inputClassName,
              isValid && "border-green-500 focus-visible:ring-green-500",
              displayError && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
        {showSearchButton && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSearch}
            disabled={disabled || loading || onlyNumbers(value).length !== 14}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
      {isValid && company && showCompanyPreview && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-sm space-y-1">
          <p className="font-medium text-green-700 dark:text-green-400">{company.razaoSocial}</p>
          {company.nomeFantasia !== company.razaoSocial && (
            <p className="text-green-600 dark:text-green-500">{company.nomeFantasia}</p>
          )}
          <p className="text-green-600 dark:text-green-500 text-xs">
            {company.situacao} | {company.porte} | {company.endereco.cidade}/{company.endereco.uf}
          </p>
        </div>
      )}
    </div>
  );
});

InputCNPJ.displayName = 'InputCNPJ';

// ==========================================
// INPUT CPF
// ==========================================

interface InputCPFProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const InputCPF = forwardRef<HTMLInputElement, InputCPFProps>(({
  id = 'cpf',
  label = 'CPF',
  value,
  onChange,
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onChange(formatted);
    setLocalError(null);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const cleanCPF = onlyNumbers(value);
    if (cleanCPF.length > 0 && cleanCPF.length < 11) {
      setLocalError('CPF deve ter 11 dígitos');
    } else if (cleanCPF.length === 11 && !isValidCPF(value)) {
      setLocalError('CPF inválido');
    }
  }, [value]);

  const displayError = error || (touched ? localError : null);
  const isValid = touched && isValidCPF(value) && !displayError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="000.000.000-00"
          maxLength={14}
          disabled={disabled}
          className={cn(
            inputClassName,
            isValid && "border-green-500 focus-visible:ring-green-500",
            displayError && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  );
});

InputCPF.displayName = 'InputCPF';

// ==========================================
// INPUT TELEFONE / CELULAR
// ==========================================

interface InputPhoneProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'phone' | 'cellphone' | 'auto';
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(({
  id = 'phone',
  label = 'Telefone',
  value,
  onChange,
  type = 'auto',
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Sempre usa formato de celular (mais flexível)
    const formatted = formatCellphone(e.target.value);
    onChange(formatted);
    setLocalError(null);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const cleanPhone = onlyNumbers(value);
    if (cleanPhone.length > 0 && cleanPhone.length < 10) {
      setLocalError('Telefone deve ter pelo menos 10 dígitos');
    } else if (cleanPhone.length > 11) {
      setLocalError('Telefone deve ter no máximo 11 dígitos');
    }
  }, [value]);

  const displayError = error || (touched ? localError : null);
  const isValid = touched && isValidPhone(value) && !displayError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="(00) 00000-0000"
          maxLength={15}
          disabled={disabled}
          className={cn(
            inputClassName,
            isValid && "border-green-500 focus-visible:ring-green-500",
            displayError && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  );
});

InputPhone.displayName = 'InputPhone';

// ==========================================
// INPUT MOEDA (CURRENCY)
// ==========================================

interface InputCurrencyProps extends BaseInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(({
  id = 'currency',
  label = 'Valor',
  value,
  onChange,
  min,
  max,
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const [displayValue, setDisplayValue] = useState(() => {
    return value > 0 ? formatCurrencyInput((value * 100).toString()) : '';
  });

  useEffect(() => {
    if (value > 0) {
      setDisplayValue(formatCurrencyInput((value * 100).toString()));
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setDisplayValue(formatted);
    const numericValue = parseCurrency(formatted);
    onChange(numericValue);
  }, [onChange]);

  const minError = min !== undefined && value > 0 && value < min;
  const maxError = max !== undefined && value > max;
  const displayError = error || (minError ? `Valor mínimo: R$ ${min.toFixed(2)}` : undefined) || (maxError ? `Valor máximo: R$ ${max.toFixed(2)}` : undefined);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        ref={ref}
        id={id}
        value={displayValue}
        onChange={handleChange}
        placeholder="R$ 0,00"
        disabled={disabled}
        className={cn(
          inputClassName,
          displayError && "border-red-500 focus-visible:ring-red-500"
        )}
      />
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  );
});

InputCurrency.displayName = 'InputCurrency';

// ==========================================
// INPUT DATA
// ==========================================

interface InputDateProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({
  id = 'date',
  label = 'Data',
  value,
  onChange,
  required,
  error,
  className,
  inputClassName,
  disabled,
}, ref) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    onChange(formatted);
    setLocalError(null);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const cleanDate = onlyNumbers(value);
    if (cleanDate.length > 0 && cleanDate.length < 8) {
      setLocalError('Data incompleta');
    } else if (cleanDate.length === 8 && !isValidDate(value)) {
      setLocalError('Data inválida');
    }
  }, [value]);

  const displayError = error || (touched ? localError : null);
  const isValid = touched && isValidDate(value) && !displayError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          disabled={disabled}
          className={cn(
            inputClassName,
            isValid && "border-green-500 focus-visible:ring-green-500",
            displayError && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  );
});

InputDate.displayName = 'InputDate';

// ==========================================
// EXPORTS
// ==========================================

export {
  type AddressData,
  type CompanyData,
  type InputCEPProps,
  type InputCNPJProps,
  type InputCPFProps,
  type InputPhoneProps,
  type InputCurrencyProps,
  type InputDateProps,
};
