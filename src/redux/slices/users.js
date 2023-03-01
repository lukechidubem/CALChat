import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: false,
  users: [], // all users of app who are not friends and not requested yet
  friends: [], // all friends
  friendRequests: [], // all friend requests
  socket: null,
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsers(state, action) {
      state.users = action.payload.users;
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
        // console.log(response);

        // toast.success("Login is successful");

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
        console.log(response);
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
        console.log(response);
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
