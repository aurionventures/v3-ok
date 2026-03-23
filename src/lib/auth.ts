const STORAGE_KEY = "legacy_user_type";

export type UserType = "company" | "member" | "admin";

export function getUserType(): UserType | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(STORAGE_KEY);
  if (v === "company" || v === "member" || v === "admin") return v;
  return null;
}

export function setUserType(type: UserType): void {
  sessionStorage.setItem(STORAGE_KEY, type);
}

export function clearUserType(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isMember(): boolean {
  return getUserType() === "member";
}

export function isAdmin(): boolean {
  return getUserType() === "admin";
}

/** ADM da empresa (empresa_adm) – pode aprovar/assinar ATAs em nome dos membros */
export function isCompanyAdm(): boolean {
  return getUserType() === "company";
}
