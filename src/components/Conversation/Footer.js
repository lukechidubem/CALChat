import React, { useRef, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleKeyDown,
}) => {
  const [openActions, setOpenActions] = React.useState(false);

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onKeyDown={handleKeyDown}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((el) => (
                <Tooltip placement="right" title={el.title}>
                  <Fab
                    onClick={() => {
                      setOpenActions(!openActions);
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const { group_current_conversation } = useSelector(
    (state) => state.conversation.group_chat
  );

  const user_id = window.localStorage.getItem("user_id");
  // const current_conversation = window.localStorage.getItem(
  //   "current_conversation"
  // );

  const isMobile = useResponsive("between", "md", "xs", "sm");

  const { sidebar } = useSelector((state) => state.app);
  const { room_id, group_room_id, chat_type } = useSelector(
    (state) => state.chat
  );
  // const { user_id } = useSelector((state) => state.auth);

  const [openPicker, setOpenPicker] = React.useState(false);

  const [value, setValue] = useState("");

  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const handleIndividualSubmit = (e) => {
    e.preventDefault();

    socket.emit("text_message", {
      message: linkify(value),
      conversation_id: room_id,
      from: user_id,
      to: current_conversation.user_id,
      type: containsUrl(value) ? "Link" : "Text",
    });

    setValue("");
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();

    socket.emit("group_text_message", {
      message: linkify(value),
      conversation_id: group_room_id,
      from: user_id,
      to: group_current_conversation.group_id,
      type: containsUrl(value) ? "Link" : "Text",
    });
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && chat_type === "individual") {
      return handleIndividualSubmit(e);
    }

    if (e.key === "Enter" && chat_type === "group") {
      return handleGroupSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        sx={{
          width: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            {/* ChatInput */}
            <Box
              sx={{
                display: openPicker ? "inline" : "none",
                zIndex: 10,
                position: "fixed",
                bottom: 81,
                right: isMobile ? 20 : sidebar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>

            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              handleKeyDown={handleKeyDown}
            />
          </Stack>

          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                onClick={
                  chat_type === "individual"
                    ? () => {
                        socket.emit("text_message", {
                          message: linkify(value),
                          conversation_id: room_id,
                          from: user_id,
                          to: current_conversation.user_id,
                          type: containsUrl(value) ? "Link" : "Text",
                        });
                        setValue("");
                      }
                    : () => {
                        socket.emit("group_text_message", {
                          message: linkify(value),
                          conversation_id: group_room_id,
                          from: user_id,
                          to: group_current_conversation.group_id,
                          type: containsUrl(value) ? "Link" : "Text",
                        });
                        setValue("");
                      }
                }
              >
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
