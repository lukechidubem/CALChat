import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { socket, connectSocket } from "../../socket";
// import useAuthStore from "../../zustand/auth";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");

  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("new_friend_request", (data) => {
        toast.success("New friend request received");
      });

      socket.on("request_accepted", (data) => {
        toast.success("Friend Request Accepted");
      });

      socket.on("request_sent", (data) => {
        toast.success(data.message);
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket.off("new_friend_request");
      socket.off("request_accepted");
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav />
        )}

        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;
