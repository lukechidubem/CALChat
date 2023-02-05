import { Box, Stack } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Message from "./Message";

const Conversation = () => {
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      <Header />
      <Box
        className="scrollHide"
        width={"100%"}
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
      >
        <Message menu={true} />
      </Box>
      <Footer />
    </Stack>
  );
};

export default Conversation;
