import {createSlice} from "@reduxjs/toolkit";

const initialState = {

};

export const chitChatSlice = createSlice({
  name: "chitchatstore",
  initialState,
  reducers: {
    loadUsersFromLocal: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const {
  loadUsersFromLocal,
} = chitChatSlice.actions;

export default chitChatSlice.reducer;