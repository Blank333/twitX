import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
    name: "",
    username: "",
    email: "",
    token: "",
    profilePicURL: "",
  },
  reducers: {
    addUser: (state, action) => {
      const { _id, name, username, email, token, profilePicURL } = action.payload;
      state._id = _id;
      state.name = name;
      state.username = username;
      state.email = email;
      state.token = token;
      state.profilePicURL = profilePicURL;
    },
    removeUser: () => {
      return {
        _id: "",
        name: "",
        username: "",
        email: "",
        token: "",
        profilePicURL: "",
      };
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
