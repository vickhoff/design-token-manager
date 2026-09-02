"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/state/store";
import { loadTokenFileState } from "@/lib/state/persistTokenFile";
import { setTokenFile } from "../lib/state/features/tokenFile/tokenFileSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const persisted = loadTokenFileState();
    if (persisted) {
      storeRef.current!.dispatch(setTokenFile(persisted));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
