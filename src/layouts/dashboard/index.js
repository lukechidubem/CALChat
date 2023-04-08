import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  SelectConversation,
  SelectGroupConversation,
} from "../../redux/slices/chat";

import { socket, connectSocket } from "../../socket";
import {
  AddDirectConversation,
  UpdateDirectConversation,
  AddDirectMessage,
  AddDirectGroupMessage,
  AddDirectGroupConversation,
  UpdateDirectGroupConversation,
} from "../../redux/slices/conversation";
import CallNotification from "../../sections/main/Audio/CallNotification";
import AudioCallNotification from "../../sections/main/Audio/CallNotification";
import VideoCallNotification from "../../sections/main/Video/CallNotification";
import {
  PushToAudioCallQueue,
  UpdateAudioCallDialog,
} from "../../redux/slices/audioCall";
import {
  PushToVideoCallQueue,
  UpdateVideoCallDialog,
} from "../../redux/slices/videoCall";
import VideoCallDialog from "../../sections/main/Video/CallDialog";
import AudioCallDialog from "../../sections/main/Audio/CallDialog";
import { UpdateShowMobile } from "../../redux/slices/app";
import { FetchFriendRequests, FetchFriends } from "../../redux/slices/users";

// import useAuthStore from "../../zustand/auth";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");

  const isMobile = useResponsive("between", "md", "xs", "sm");

  const { show_mobile } = useSelector((store) => store.app);

  const { isLoggedIn } = useSelector((state) => state.auth);

  const { open_audio_notification_dialog, open_audio_dialog } = useSelector(
    (state) => state.audioCall
  );
  const { open_video_notification_dialog, open_video_dialog } = useSelector(
    (state) => state.videoCall
  );
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const { chat_type } = useSelector((state) => state.chat);

  const { group_conversations, group_current_conversation } = useSelector(
    (state) => state.conversation.group_chat
  );

  const dispatch = useDispatch();

  // const user_id = window.localStorage.getItem("user_id");
  const { user_id } = useSelector((state) => state.auth);

  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
  };
  const handleCloseVideoDialog = () => {
    dispatch(UpdateVideoCallDialog({ state: false }));
  };

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.emit("disconnect_on_reload");
    });
    // socket.on('disconnect', () => {
    //   console.log(`Disconnected: ${socket.id}`);
    // });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      window.onload();
    }

    dispatch(FetchFriends());
    dispatch(FetchFriendRequests());
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // window.onload = function () {
      //   if (!window.location.hash) {
      //     window.location = window.location + "#loaded";
      //     window.location.reload();
      //   }
      // };

      // window.onload();

      if (!isDesktop) {
        dispatch(UpdateShowMobile({ show_mobile: true }));
      }

      if (!socket) {
        connectSocket(user_id);
      }

      socket.on("audio_call_notification", (data) => {
        dispatch(PushToAudioCallQueue(data));
      });

      socket.on("video_call_notification", (data) => {
        dispatch(PushToVideoCallQueue(data));
      });

      socket.on("new_message", (data) => {
        const message = data.message;
        // console.log(current_conversation, conversations, data);
        // check if msg we got is from currently selected conversation
        if (current_conversation.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

      socket.on("new_group_message", (data) => {
        const message = data.message;

        if (group_current_conversation.group_id === data.conversation_id) {
          dispatch(
            AddDirectGroupMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

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

      socket.on("start_group_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = group_conversations.find(
          (el) => el.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectGroupConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectGroupConversation({ conversation: data }));
        }

        dispatch(SelectGroupConversation({ group_room_id: data._id }));
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
      // socket?.off("open_chat");
      socket?.off("start_chat");
      socket?.off("start_group_chat");
      socket?.off("new_message");
      socket?.off("new_group_message");

      socket?.off("audio_call_notification");
    };
  }, [isLoggedIn, current_conversation, group_current_conversation, chat_type]);
  // }, [isLoggedIn, chat_type, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction="row" width={"auto"}>
        {/* {isDesktop && ( */}
        {/* // SideBar */}
        <SideNav />
        {/* )} */}

        <Outlet />
      </Stack>

      {open_audio_notification_dialog && (
        <AudioCallNotification open={open_audio_notification_dialog} />
      )}
      {open_audio_dialog && (
        <AudioCallDialog
          open={open_audio_dialog}
          handleClose={handleCloseAudioDialog}
        />
      )}
      {open_video_notification_dialog && (
        <VideoCallNotification open={open_video_notification_dialog} />
      )}
      {open_video_dialog && (
        <VideoCallDialog
          open={open_video_dialog}
          handleClose={handleCloseVideoDialog}
        />
      )}
    </>
  );
};

export default DashboardLayout;
