import { Link as RouterLink } from "react-router-dom";
import { Stack, Typography, Link, Divider } from "@mui/material";
import React from "react";
import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";

const Login = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography sx={{ mb: 3, textAlign: "center" }} variant="h4">
          Login To Your CALChat Account
        </Typography>

        {/* Login Form */}
        <LoginForm />

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New User?</Typography>
          <Link to="/auth/register" component={RouterLink} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
        {/* Auth Social */}
        <Divider
          sx={{
            my: 2,
            typography: "overline",
            color: "text.disabled",
            "&::before, ::after": {
              borderTopStyle: "dashed",
            },
          }}
        >
          OR LOGIN WITH
        </Divider>

        <AuthSocial />
      </Stack>
    </>
  );
};

export default Login;
