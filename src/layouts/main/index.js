import { Container, Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// import Logo from "../../assets/Images/T-logo.png";
import Logo from "../../assets/Images/logo-calc-only.png";
import SignupImg from "../../assets/Images/logo-black.png";
import { useSelector } from "react-redux";
// import useAuthStore from "../../zustand/auth";

const MainLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={"/app"} />;
  }
  return (
    <>
      {/* <div className="relative w-full h-screen bg-zinc-900/100">
        <img
          className="absolute w-full h-full object-cover mix-blend-overlay"
          src={SignupImg}
          alt=""
        /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block">
          <img className="h-full w-full object-cover" src={SignupImg} alt="" />
        </div>
        <Container sx={{ mt: 5 }} maxWidth="sm">
          <Stack spacing={5}>
            <Stack
              sx={{ width: "100%", mt: 16 }}
              direction="column"
              alignItems={"center"}
            >
              {/* <img style={{ height: 120, width: 120 }} src={Logo} alt="Logo" /> */}
            </Stack>
          </Stack>

          <Outlet />
        </Container>
      </div>
    </>
  );
};

export default MainLayout;
