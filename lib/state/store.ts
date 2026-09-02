import { configureStore } from "@reduxjs/toolkit";
import tokenFileReducer from "./features/tokenFile/tokenFileSlice";
import { saveTokenFileState } from "./persistTokenFile";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      tokenFile: tokenFileReducer,
    },
  });

  if (typeof window !== "undefined") {
    store.subscribe(() => {
      saveTokenFileState(store.getState().tokenFile);
    });
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
