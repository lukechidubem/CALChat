import React, { useEffect } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat } from "phosphor-react";

import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectConversation,
  SelectGroupConversation,
} from "../redux/slices/chat";
import { toast } from "react-toastify";
import {
  FetchCurrentGroupMessages,
  FetchDirectGroupConversations,
  SetCurrentGroupConversation,
} from "../redux/slices/conversation";
// import { useSelector } from "react-redux";

const user_id = window.localStorage.getItem("user_id");

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const GroupElement = ({ photo, name, _id, handleClose }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { group_conversations, group_current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const { group_room_id } = useSelector((state) => state.chat);

  // const { user_id } = useSelector((state) => state.auth);

  // const name = `${firstName} ${lastName}`;

  useEffect(() => {
    const setCC = async () => {
      await socket.emit(
        "get_direct_group_conversations",
        { user_id },
        (data) => {
          // this data is the list of conversations
          // dispatch action

          dispatch(
            FetchDirectGroupConversations({ group_conversations: data })
          );
        }
      );

      const current = await group_conversations.find(
        (el) => el.id === group_room_id
      );

      socket.emit(
        "get_group_messages",
        { conversation_id: current?.id },
        (data) => {
          // data => list of messages

          dispatch(FetchCurrentGroupMessages({ messages: data }));
        }
      );

      // await dispatch(SetCurrentGroupConversation(current));
    };

    setCC();
  }, [group_room_id]);

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Avatar alt={name} src={photo} />

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={async () => {
              await socket.emit(
                "joinRoom",
                { roomId: _id, user_id: user_id },
                async () => {
                  dispatch(SelectGroupConversation({ group_room_id: null }));
                  toast.success(`You have joined ${name} group`);
                  handleClose();
                }
              );
            }}
          >
            Join Group
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

// FriendElement

const UserGroupElement = ({ photo, name, _id, handleClose }) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  // const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <Avatar alt={name} src={photo} />

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              dispatch(SelectGroupConversation({ group_room_id: _id }));

              handleClose();
            }}
          >
            <Chat />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { GroupElement, UserGroupElement };
