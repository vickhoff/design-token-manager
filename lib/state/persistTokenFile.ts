import { TokenFileState } from "./features/tokenFile/tokenFileSlice";

const STORAGE_KEY = "tokenFile";

export function loadTokenFileState(): TokenFileState | undefined {
  if (typeof window === "undefined") return undefined;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return undefined;

  try {
    return JSON.parse(raw) as TokenFileState;
  } catch {
    return undefined;
  }
}

export function saveTokenFileState(state: TokenFileState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
