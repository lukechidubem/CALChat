import React, { useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
// import { faker } from "@faker-js/faker";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";

// import SimpleBar from "simplebar-react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement, { ChatElement2 } from "../../components/ChatElement";
import { useDispatch, useSelector } from "react-redux";
import { GetUserChats } from "../../redux/slices/chat";

function Chats() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const { userChats } = useSelector((state) => state.chat);

  // console.log("charts", userChats);
  // console.log("recipient", recipientUser);
  // console.log("user", user);

  useEffect(() => {
    if (user) {
      dispatch(GetUserChats(user._id));
    }
  }, [user, dispatch]);

  return (
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
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
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
            <Button>Archive</Button>
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
                Pinned
              </Typography>
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>
              {ChatList.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} />;
              })}

              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                Testing
              </Typography>
              {userChats.map((chat, index) => {
                return <ChatElement2 chat={chat} user={user} />;
              })}
            </Stack>
            {/* </SimpleBar> */}
          </SimpleBarStyle>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Chats;
