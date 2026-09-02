import { configureStore } from "@reduxjs/toolkit";
import tokenFileReducer from "./features/tokenFile/tokenFileSlice";
import { loadTokenFileState } from "./persistTokenFile";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tokenFile: tokenFileReducer,
    },
    preloadedState: {
      tokenFile: loadTokenFileState() ?? { rawFile: null, jsonFile: null },
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
