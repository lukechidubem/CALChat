import { createSlice } from "@reduxjs/toolkit";

//
// import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },

  // isLoggedIn: true,
  tab: 0,

  // users: [], // all users of app who are not friends and not requested yet
  // friends: [], // all friends
  // friendRequests: [], // all friend requests

  // snackbar: {
  //   open: null,
  //   severity: null,
  //   message: null,
  // },
};

const slice = createSlice({
  name: "app",
  initialState,

  reducers: {
    // Toggle Sidebar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },

    updateTab(state, action) {
      state.tab = action.payload.tab;
    },

    // openSnackBar(state, action) {
    //   console.log(state.snackbar, state.sidebar);
    //   console.log(action.payload);
    //   state.snackbar.open = true;
    //   state.snackbar.severity = action.payload.severity;
    //   state.snackbar.message = action.payload.message;
    // },

    // closeSnackBar(state) {
    //   console.log("This is getting executed");
    //   state.snackbar.open = false;
    //   state.snackbar.message = null;
    // },
  },
});

// Reducer
export default slice.reducer;

// export const closeSnackBar = () => async (dispatch, getState) => {
//   dispatch(slice.actions.closeSnackBar());
// };

// export const showSnackbar =
//   ({ severity, message }) =>
//   async (dispatch, getState) => {
//     dispatch(
//       slice.actions.openSnackBar({
//         message,
//         severity,
//       })
//     );

//     setTimeout(() => {
//       dispatch(slice.actions.closeSnackBar());
//     }, 4000);
//   };

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateSidebarType({
        type,
      })
    );
  };
}

export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateTab({ tab }));
  };
}