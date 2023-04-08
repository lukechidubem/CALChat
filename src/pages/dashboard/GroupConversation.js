import { Stack, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef } from "react";
import { SimpleBarStyle } from "../../components/Scrollbar";

import { ChatHeader, ChatFooter } from "../../components/Conversation";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History } from "../../data";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../components/Conversation/MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentGroupMessages,
  FetchCurrentMessages,
  SetCurrentConversation,
  SetCurrentGroupConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const GroupConversation = ({ isMobile, menu }) => {
  const dispatch = useDispatch();

  //   const { conversations, current_messages } = useSelector(
  //     (state) => state.conversation.direct_chat
  //   );

  const { group_conversations, group_current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const { group_room_id } = useSelector((state) => state.chat);

  useEffect(() => {
    const setCC = async () => {
      const current = await group_conversations.find(
        (el) => el.id === group_room_id
      );

      socket.emit(
        "get_group_messages",
        { conversation_id: current.id },
        (data) => {
          // data => list of messages

          dispatch(FetchCurrentGroupMessages({ messages: data }));
        }
      );

      dispatch(SetCurrentGroupConversation(current));
    };

    setCC();
  }, [group_room_id]);

  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {group_current_messages.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                // Timeline
                <Timeline el={el} />
              );

            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    // Media Message
                    <MediaMsg el={el} menu={menu} />
                  );

                case "doc":
                  return (
                    // Doc Message
                    <DocMsg el={el} menu={menu} />
                  );
                case "Link":
                  return (
                    //  Link Message
                    <LinkMsg el={el} menu={menu} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg el={el} menu={menu} />
                  );

                default:
                  return (
                    // Text Message
                    <TextMsg el={el} menu={menu} />
                  );
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

const GroupComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const messageListRef = useRef(null);

  const { group_current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [group_current_messages]);

  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/*  */}
      <ChatHeader />
      <Box
        className="scrollHide"
        ref={messageListRef}
        // width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <GroupConversation menu={true} isMobile={isMobile} />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default GroupComponent;

export { GroupConversation };
