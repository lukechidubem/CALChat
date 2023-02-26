import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
// import { Navigate } from "react-router-dom";

// import { showSnackbar } from "./app";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  email: "",
  error: false,
  user: "",
  user_id: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LoginUser(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.user_id = action.payload.user_id;
    },

    SignOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user = "";
      state.user_id = null;
    },

    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },

    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
  },
});

export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/api/users/login",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);

        toast.success("Login is successful");
        dispatch(
          slice.actions.LoginUser({
            isLoggedIn: true,
            token: response.data.token,
            user: response.data.data.user,
            user_id: response.data.user_id,
          })
        );

        window.localStorage.setItem("user_id", response.data.user_id);

        // dispatch(
        //   showSnackbar({
        //     severity: "success",
        //     message: response.data.message,
        //   })
        // );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        toast.error(error.response.data.message);

        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.SignOut());
  };
}

export function forgotPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/api/users/forgotPassword",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        // dispatch(
        //   showSnackbar({
        //     severity: "success",
        //     message: response.data.message,
        //   })
        // );
        toast.success("Password reset link sent to your email");

        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function NewPassword(formValues, token) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .patch(
        `/api/users/resetPassword/${token}`,
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.LoginUser({
            isLoggedIn: true,
            token: response.data.token,
            user: response.data.data.user,
            user_id: response.data.user_id,
          })
        );

        window.localStorage.setItem("user_id", response.data.user_id);

        toast.success("Password reset is successful");

        // dispatch(
        //   showSnackbar({
        //     severity: "success",
        //     message: response.data.message,
        //   })
        // );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/api/users/signup",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);

        dispatch(
          slice.actions.updateRegisterEmail({ email: formValues.email })
        );

        toast.success("OTP sent to your email");

        // dispatch(
        //   showSnackbar({
        //     severity: "success",
        //     message: response.data.message,
        //   })
        // );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
          // toast.success("OTP sent to your email");
          // return <Navigate to={"/auth/verify"} />;
        }
      });
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/api/users/verifyOTP",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        // console.log(response);

        dispatch(slice.actions.updateRegisterEmail({ email: "" }));

        toast.success("New User verification is successful");

        dispatch(
          slice.actions.LoginUser({
            isLoggedIn: true,
            token: response.data.token,
            user: response.data.data.user,
            user_id: response.data.user_id,
          })
        );

        window.localStorage.setItem("user_id", response.data.user_id);

        // dispatch(
        //   showSnackbar({
        //     severity: "success",
        //     message: response.data.message,
        //   })
        // );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        toast.error(error.response.data.message);
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
  };
}
