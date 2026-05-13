import { AuditInput } from "../types/audit";

const STORAGE_KEY = "credex_audit_form_v1";

interface PersistedFormState {
  version: 1; // Bump on breaking schema changes
  lastUpdated: string; // ISO timestamp — expire after 7 days
  auditInput: Partial<AuditInput>;
}

/**
 * Saves partial form state to localStorage.
 */
export function saveFormState(input: Partial<AuditInput>): void {
  if (typeof window === "undefined") return;

  try {
    const state: PersistedFormState = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      auditInput: input,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_error) {
    console.error("Failed to save form state to localStorage", _error);
    // Silent fail — localStorage can throw in private browsing/storage full
  }
}

/**
 * Loads form state from localStorage. Returns null if expired, invalid, or absent.
 */
export function loadFormState(): Partial<AuditInput> | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as PersistedFormState;

    // Check version
    if (parsed.version !== 1) {
      clearFormState();
      return null;
    }

    // Check expiration (7 days)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const lastUpdatedTime = new Date(parsed.lastUpdated).getTime();
    if (Date.now() - lastUpdatedTime > SEVEN_DAYS_MS) {
      clearFormState();
      return null;
    }

    return parsed.auditInput;
  } catch (error) {
    console.error("Failed to load form state from localStorage", error);
    return null;
  }
}

/**
 * Clears form state from localStorage.
 */
export function clearFormState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_error) {
    // Silent fail
  }
}
