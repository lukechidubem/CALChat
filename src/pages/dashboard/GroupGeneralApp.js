import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import Contact from "../../components/Contact";
import SignupImg from "../../assets/Images/logo-black.png";

import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import { Link, useSearchParams } from "react-router-dom";
import Group from "./Group";
import GroupComponent from "./GroupConversation";
import useResponsive from "../../hooks/useResponsive";
// import socket from "../../socket";

const GroupGeneralApp = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const { sidebar, show_mobile } = useSelector((store) => store.app);
  const { chat_type, group_room_id } = useSelector((store) => store.chat);
  const isDesktop = useResponsive("up", "md");
  // const isMobile = useResponsive("between", "md", "xs", "md");

  return (
    <>
      {isDesktop && (
        <Stack direction={"row"} sx={{ width: "100%" }}>
          <Group />
          <Box
            sx={{
              height: "100%",
              width: sidebar.open
                ? "calc(100vw - 740px)"
                : "calc(100vw - 402px)",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#F0F4FA"
                  : theme.palette.background.paper,

              borderBottom:
                searchParams.get("type") === "individual-chat" &&
                searchParams.get("id")
                  ? "0px"
                  : "6px solid #0162C4",
            }}
          >
            {/* <Conversation /> */}

            {chat_type === "group" && group_room_id !== null ? (
              <GroupComponent />
            ) : (
              <Stack
                spacing={2}
                sx={{ height: "100%", width: "100%" }}
                alignItems="center"
                justifyContent={"center"}
              >
                {/* <NoChat /> */}
                <img className="rounded-xl" src={SignupImg} alt="" />

                <Typography variant="subtitle2">
                  Select a conversation or start a{" "}
                  <Link
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                    }}
                    to="/"
                  >
                    new one
                  </Link>
                </Typography>
              </Stack>
            )}
          </Box>
          {sidebar.open &&
            (() => {
              switch (sidebar.type) {
                case "CONTACT":
                  return <Contact />;

                case "STARRED":
                  return <StarredMessages />;

                case "SHARED":
                  return <SharedMessages />;

                default:
                  break;
              }
            })()}{" "}
        </Stack>
      )}

      {/* ================= For Mobile ========================== */}

      {!isDesktop && (
        <Stack sx={{ width: "auto" }}>
          {!show_mobile && (
            <Box
              sx={{
                height: "100%",
                width: "auto",
              }}
            >
              <Group />
            </Box>
          )}
          {show_mobile && (
            <Box
              sx={{
                height: "100%",
                // maxWidth: "25rem",
                width: "100%",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#F0F4FA"
                    : theme.palette.background.paper,

                borderBottom:
                  searchParams.get("type") === "individual-chat" &&
                  searchParams.get("id")
                    ? "0px"
                    : "6px solid #0162C4",
              }}
            >
              {chat_type === "group" && group_room_id !== null ? (
                <GroupComponent />
              ) : (
                <Stack
                  spacing={2}
                  sx={{ height: "100%", width: "100%" }}
                  alignItems="center"
                  justifyContent={"center"}
                >
                  {/* <NoChat /> */}
                  <img className="rounded-xl" src={SignupImg} alt="" />

                  <Typography variant="subtitle2">
                    Select a group conversation or create a{" "}
                    <Link
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                      to="/"
                    >
                      new one
                    </Link>
                  </Typography>
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      )}
    </>
  );
};

export default GroupGeneralApp;
