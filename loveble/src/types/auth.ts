export type UserRole = 'admin' | 'parceiro' | 'cliente';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parceiroId?: string; // Para usuários parceiro
  empresaId?: string; // Para clientes
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  parceiroId: string;
  maturityScore?: number;
  lastAssessment?: Date;
}

export interface ParceiroData {
  id: string;
  name: string;
  clients: Company[];
  totalClients: number;
}