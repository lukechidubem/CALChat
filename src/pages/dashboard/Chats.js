import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
// import { faker } from "@faker-js/faker";
import { ChatList } from "../../data";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import { SimpleBarStyle } from "../../components/Scrollbar";

// import SimpleBar from "simplebar-react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement, {
  ChatElement2,
  UsersChatElement,
} from "../../components/ChatElement";
import { useDispatch, useSelector } from "react-redux";
import { GetUserChats } from "../../redux/slices/chat";
import { CreateChat } from "../../redux/slices/chat";
import { GetUsers } from "../../redux/slices/users";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { FetchDirectConversations } from "../../redux/slices/conversation";

const user_id = window.localStorage.getItem("user_id");

function Chats() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const { userChats } = useSelector((state) => state.chat);
  // const { userChats } = useSelector((state) => state.chat);
  const { users, friends } = useSelector((state) => state.users);
  const [potentialChats, setPotentialChats] = useState([]);
  const [showPotentialChats, setShowPotentialChats] = useState(false);

  const isDesktop = useResponsive("up", "md");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      console.log(data); // this data is the list of conversations
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

  useEffect(() => {
    if (user) {
      dispatch(GetUserChats(user._id));
    }
  }, [user]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(GetUsers());
    }

    if (!users) return;

    const privateChats = users.filter((u) => {
      let isChatCreated = false;
      if (user._id === u._id) return false;

      if (userChats) {
        isChatCreated = userChats?.some((chat) => {
          return chat.members[0] === u._id || chat.members[1] === u._id;
        });
      }

      return !isChatCreated;
    });

    setPotentialChats(privateChats);
  }, [userChats]);

  // const onStartChat = ()=>{

  // }

  // console.log("pChats", potentialChats);
  return (
    <>
      <Box
        sx={{
          position: "relative",

          width: 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}

        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Button onClick={() => setShowPotentialChats(false)} variant="h5">
              Chats
            </Button>

            <Button onClick={() => setShowPotentialChats(true)}>
              New Chats
            </Button>

            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                <Users />
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
              {!showPotentialChats ? (
                <Stack spacing={2.4}>
                  {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                    Pinned
                  </Typography>
                  {ChatList.filter((el) => el.pinned).map((el) => {
                    return <ChatElement {...el} />;
                  })} */}
                  <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                    All Chats
                  </Typography>
                  {conversations
                    .filter((el) => !el.pinned)
                    .map((el, idx) => {
                      return <ChatElement {...el} />;
                    })}

                  {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                    Testing
                  </Typography>
                  {userChats &&
                    userChats.map((chat, index) => {
                      return (
                        <ChatElement2 chat={chat} user={user} key={index} />
                      );
                    })} */}
                </Stack>
              ) : (
                <Stack spacing={2.4}>
                  {friends &&
                    // potentialChats.map((el, index) => {
                    friends.map((el, index) => {
                      return <ChatElement {...el} />;
                    })}
                </Stack>
              )}
              {/* </SimpleBar> */}
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
