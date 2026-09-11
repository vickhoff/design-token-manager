import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ParseResult, FileObject, Token } from "@/lib/tokens/types";

export interface TokenFileState {
  rawFile: FileObject | null;
  jsonFile: ParseResult | null;
}

export interface UpdateTokenFileState {
  id: string;
  value: Token["value"];
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
    updateTokenFile(state, action: PayloadAction<UpdateTokenFileState>) {
      if (!state.jsonFile) return;
      const token = state.jsonFile.tokens.find(
        (t) => t.id === action.payload.id,
      );
      if (!token) return;
      token.value = action.payload.value;
    },
    clearTokenFile(state) {
      state.rawFile = null;
      state.jsonFile = null;
    },
  },
});

export const { setTokenFile, clearTokenFile, updateTokenFile } =
  tokenFileSlice.actions;
export default tokenFileSlice.reducer;
