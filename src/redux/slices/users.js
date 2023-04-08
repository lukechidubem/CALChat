import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  user: {},
  isLoading: false,
  error: false,
  users: [], // all users of app who are not friends and not requested yet
  all_users: [],
  friends: [], // all friends
  friendRequests: [], // all friend requests
  socket: null,

  user_group_chats: [],
  all_group_chats: [],
  user_own_group_chats: [],
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },

    updateUsers(state, action) {
      state.users = action.payload.users;
    },

    updateAllUsers(state, action) {
      state.all_users = action.payload.users;
    },

    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },

    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },

    updateSocket(state, action) {
      state.socket = action.payload.socket;
    },

    updateGroups(state, action) {
      state.all_group_chats = action.payload.all_group_chats;
    },

    updateUsersGroups(state, action) {
      state.user_group_chats = action.payload.user_group_chats;
    },

    updateUsersOwnGroups(state, action) {
      state.user_own_group_chats = action.payload.user_own_group_chats;
    },
  },
});

export default slice.reducer;

export function GetUsers() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .get(
        `/api/users/find`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateUsers({
            users: response.data,
          })
        );

        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);

        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function FetchUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getAll",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchAllUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/get-all-verified-users",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchFriends() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getFriends",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getRequests",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateFriendRequests({ requests: response.data.data })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function UpdateSocket(socket) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSocket({ socket }));
  };
}

export function FetchGroups() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getGroups",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateGroups({ all_group_chats: response.data.data })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchUserOwnGroups() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getUserOwnGroups",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateUsersOwnGroups({
            user_own_group_chats: response.data.data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function FetchUserGroups() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/api/users/getUserGroups",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateUsersGroups({
            user_group_chats: response.data.data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export const FetchUserProfile = () => {
  return async (dispatch, getState) => {
    axios
      .get("/api/users/get-me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        dispatch(slice.actions.fetchUser({ user: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const UpdateUserProfile = (formData) => {
  return async (dispatch, getState) => {
    // const file = formData.avatar;

    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .patch("/api/users/update-me", formData, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch(slice.actions.updateUser({ user: response.data.data }));

        toast.success("Profile updated successfully");

        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
