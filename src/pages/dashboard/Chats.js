import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
  Badge,
} from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";

import { SimpleBarStyle } from "../../components/Scrollbar";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation } from "../../redux/slices/chat";

import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { FetchDirectConversations } from "../../redux/slices/conversation";
import { UpdateShowMobile } from "../../redux/slices/app";
import { v4 as uuidv4 } from "uuid";

const user_id = window.localStorage.getItem("user_id");

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

function Chats() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { show_mobile } = useSelector((store) => store.app);

  const { friendRequests } = useSelector((state) => state.users);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      // this data is the list of conversations
      // dispatch action

      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickChatElement = (id) => {
    dispatch(SelectConversation({ room_id: id }));
    dispatch(UpdateShowMobile({ show_mobile: true }));
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",

          width: show_mobile ? "auto" : 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Button variant="h5">Chats</Button>

            {/* <Button onClick={() => setShowPotentialChats(true)}>
              New Chats
            </Button> */}

            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                {friendRequests.length > 0 ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    variant="dot"
                  >
                    New Chats
                  </StyledBadge>
                ) : (
                  <Typography> New Chats</Typography>
                )}
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>

          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button variant="text">Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            className="scrollHide"
            spacing={2}
            direction="column"
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              height: "100%",
            }}
          >
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Chats
                </Typography>
                {conversations
                  .filter((el) => !el.pinned)
                  .sort(
                    (a, b) =>
                      new Date(a.msg.created_at) - new Date(b.msg.created_at)
                  )
                  .map((el, idx) => {
                    return (
                      <ChatElement
                        {...el}
                        key={idx}
                        handleClick={handleClickChatElement}
                      />
                    );
                  })}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>

      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
}

export default Chats;
