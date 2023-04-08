import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { SimpleBarStyle } from "../../components/Scrollbar";
import ChatElement from "../../components/ChatElement";
import CreateGroup from "../../sections/main/CreateGroup";
import Groups from "../../sections/main/Groups";
import { useDispatch, useSelector } from "react-redux";
// import { UserGroupElement } from "../../components/GroupElement";
import { SelectGroupConversation } from "../../redux/slices/chat";
import { FetchDirectGroupConversations } from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { UpdateShowMobile } from "../../redux/slices/app";

const user_id = window.localStorage.getItem("user_id");

const Group = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  const { group_conversations, group_current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );

  const { show_mobile } = useSelector((store) => store.app);

  const { group_room_id } = useSelector((state) => state.chat);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  const handleOpenDialog2 = () => {
    setOpenDialog2(true);
  };

  const handleClickChatElement = (id) => {
    dispatch(SelectGroupConversation({ group_room_id: id }));
    dispatch(UpdateShowMobile({ show_mobile: true }));
  };

  useEffect(() => {
    socket.emit("get_direct_group_conversations", { user_id }, async (data) => {
      // this data is the list of conversations
      // dispatch action
      dispatch(FetchDirectGroupConversations({ group_conversations: data }));
    });
  }, [group_room_id]);

  return (
    <>
      {/* <Stack direction={"row"} sx={{ width: "100%" }}> */}
      <Box
        sx={{
          // height: "100vh",
          width: show_mobile ? "auto" : 320,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#FBFAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack>
            <Typography variant="h5">Groups</Typography>
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

          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* <IconButton onClick={() => handleOpenDialog2()}> */}
            <Button
              style={{ color: theme.palette.primary.main }}
              variant="subtitle2"
              onClick={() => handleOpenDialog2()}
            >
              Explore Groups
            </Button>
            {/* </IconButton> */}

            <IconButton onClick={() => setOpenDialog(true)}>
              <Plus style={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Stack>

          <Divider />

          <Stack
            className="scrollHide"
            spacing={2}
            //   direction="column"
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
              height: "100%",
            }}
          >
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Group Chats
                </Typography>

                {group_conversations?.map((el) => {
                  return (
                    <ChatElement {...el} handleClick={handleClickChatElement} />
                  );
                })}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {/* </Stack> */}
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}

      {openDialog2 && (
        <Groups open={openDialog2} handleClose={handleCloseDialog2} />
      )}
    </>
  );
};

export default Group;
