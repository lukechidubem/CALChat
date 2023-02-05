import React from "react";
// import { useNavigation } from "react-router-dom";
import { Divider, IconButton, Stack } from "@mui/material";
import {
  FacebookLogo,
  GithubLogo,
  GoogleLogo,
  TwitterLogo,
} from "phosphor-react";

const AuthSocial = () => {
  return (
    <div>
      <Stack direction={"row"} justifyContent="center" spacing={2}>
        <IconButton>
          <GoogleLogo color="#DF3E30" />
        </IconButton>
        <IconButton color="inherit">
          <GithubLogo />
        </IconButton>
        <IconButton>
          <TwitterLogo color="#1C9CEA" />
        </IconButton>
        <IconButton>
          <FacebookLogo color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default AuthSocial;
