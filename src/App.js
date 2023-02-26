import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings";
import "./style.css";
// import { closeSnackBar } from "./redux/slices/app";
import socket from "./socket";

// const vertical = "bottom";
// const horizontal = "center";

// const Alert = React.forwardRef((props, ref) => (
//   <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// ));

function App() {
  useEffect(() => {
    socket.on("new_friend_request", (data) => {
      alert("New friend request received");
      console.log(data);
    });

    // Remove event listener on component unmount
    return () => socket.off("new_friend_request");
  }, []);

  // const dispatch = useDispatch();
  // const { severity, message, open } = useSelector(
  //   (state) => state.app.snackbar
  // );
  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>
      <ToastContainer />

      {/* {message && open ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => {
            dispatch(closeSnackBar());
          }}
        >
          <Alert
            onClose={() => {
              dispatch(closeSnackBar());
            }}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )} */}
    </>
  );
}

export default App;
