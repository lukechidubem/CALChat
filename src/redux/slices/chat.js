import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  userChats: "",
  isLoading: false,
  error: false,

  chat_type: null,
  room_id: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // LoginUser(state, action) {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    //   state.token = action.payload.token;
    // },

    getUserChats(state, action) {
      state.userChats = action.payload.userChats;
    },

    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },

    // updateRegisterEmail(state, action) {
    //   state.email = action.payload.email;
    // },

    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
  },
});

export default slice.reducer;

export function GetUserChats(userId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .get(
        `/api/chats/${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);

        // toast.success("Login is successful");

        dispatch(
          slice.actions.getUserChats({
            userChats: response.data,
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

export function CreateChat(firstId, secondId) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        `/api/chats`,
        {
          firstId,
          secondId,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);

        // toast.success("Login is successful");

        dispatch(
          slice.actions.getUserChats({
            userChats: response.data.chats,
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

export const SelectConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    console.log(room_id);
    dispatch(slice.actions.selectConversation({ room_id }));
  };
};
