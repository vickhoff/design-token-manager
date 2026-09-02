import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ParseResult, FileObject } from "@/lib/tokens/types";

export interface TokenFileState {
  rawFile: FileObject | null;
  jsonFile: ParseResult | null;
}

const initialState: TokenFileState = {
  rawFile: null,
  jsonFile: null,
};

const tokenFileSlice = createSlice({
  name: "tokenFile",
  initialState,
  reducers: {
    setTokenFile(state, action: PayloadAction<TokenFileState>) {
      state.rawFile = action.payload.rawFile;
      state.jsonFile = action.payload.jsonFile;
    },
    clearTokenFile(state) {
      state.rawFile = null;
      state.jsonFile = null;
    },
  },
});

export const { setTokenFile, clearTokenFile } = tokenFileSlice.actions;
export default tokenFileSlice.reducer;
