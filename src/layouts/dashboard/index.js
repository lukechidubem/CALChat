import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { SelectConversation } from "../../redux/slices/chat";

import { socket, connectSocket } from "../../socket";
import {
  AddDirectConversation,
  UpdateDirectConversation,
} from "../../redux/slices/conversation";
// import useAuthStore from "../../zustand/auth";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");

  const { isLoggedIn } = useSelector((state) => state.auth);

  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

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

      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }

        dispatch(SelectConversation({ room_id: data._id }));
      });

      socket.on("open_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }

        dispatch(SelectConversation({ room_id: data._id }));
      });

      socket.on("new_friend_request", (data) => {
        toast.success("New friend request received");
      });

      socket.on("request_accepted", (data) => {
        toast.success("Friend Request Accepted");
      });

      socket.on("request_sent", (data) => {
        // toast.success(data.message);
        toast.success("Request Sent successfully!");
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("open_chat");
      socket?.off("start_chat");
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
