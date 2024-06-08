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
    following: [],
    followers: [],
  },
  reducers: {
    addUser: (state, action) => {
      const { _id, name, username, email, token, profilePicURL, following, followers } = action.payload;
      state._id = _id;
      state.name = name;
      state.username = username;
      state.email = email;
      state.token = token;
      state.profilePicURL = profilePicURL;
      state.following = following;
      state.followers = followers;
    },
    updateFollowers: (state, action) => {
      const { followers } = action.payload;
      return {
        ...state,
        followers,
      };
    },
    updateFollowing: (state, action) => {
      const { following } = action.payload;
      return {
        ...state,
        following,
      };
    },
    updateProfilePic: (state, action) => {
      const { profilePicURL } = action.payload;
      return {
        ...state,
        profilePicURL,
      };
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

export const { addUser, removeUser, updateFollowers, updateFollowing, updateProfilePic } = userSlice.actions;
export default userSlice.reducer;
