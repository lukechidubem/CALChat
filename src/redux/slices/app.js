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

  show_mobile: false,
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

    updateShowMobile(state, action) {
      state.show_mobile = action.payload.show_mobile;
    },
  },
});

// Reducer
export default slice.reducer;

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

export function UpdateShowMobile(data) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateShowMobile(data));
  };
}
