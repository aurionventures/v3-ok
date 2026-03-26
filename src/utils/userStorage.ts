export interface StoredUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  company?: string;
}

export const saveUserToStorage = (user: StoredUser): void => {
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const getUserFromStorage = (): StoredUser | null => {
  const stored = localStorage.getItem('authUser');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem('authUser');
};
