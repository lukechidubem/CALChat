import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Divider, Link, Stack, Typography } from "@mui/material";
import RegisterForm from "../../sections/auth/RegisterForm";
import AuthSocial from "../../sections/auth/AuthSocial";

const Register = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography sx={{ mb: 3, textAlign: "center" }} variant="h3">
          Register To Join CALChat Family
        </Typography>

        {/* Register Form */}

        <RegisterForm />

        <Typography
          component={"div"}
          sx={{
            color: "text.secondary",

            typography: "caption",
            textAlign: "center",
          }}
        >
          {"By signining up, I agree to "}
          <Link underline="always" color="text.primary">
            Terms of service
          </Link>
          {" and "}
          <Link underline="always" color="text.primary">
            Privacy Policy
          </Link>
          .
        </Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">Already a CALChat member?</Typography>
          <Link component={RouterLink} to="/auth/login" variant="subtitle2">
            Sign in
          </Link>
        </Stack>
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
          OR REGISTER WITH
        </Divider>
        <AuthSocial />
      </Stack>
    </>
  );
};

export default Register;
