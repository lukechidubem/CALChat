import React from "react";
import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { faker } from "@faker-js/faker";

import { Profile_Menu } from "../../data";
import { CaretCircleRight } from "phosphor-react";
// import useAuthStore from "../../zustand/auth";

const getPath = (index) => {
  switch (index) {
    case 0:
      return "/profile";

    case 1:
      return "/settings";

    case 2:
      return "/logout";

    default:
      break;
  }
};

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  // const logOut = useAuthStore((state) => state.logOut);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTab = (index) => {
    navigate(getPath(index));
  };

  return (
    <>
      <Stack direction="row" alignItems={"center"}>
        <Avatar
          id="profile-positioned-button"
          aria-controls={openMenu ? "profile-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          alt={faker.name.fullName()}
          src={faker.image.avatar()}
        />
        <IconButton onClick={handleClick}>
          <CaretCircleRight />
        </IconButton>
        <Menu
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          TransitionComponent={Fade}
          id="profile-positioned-menu"
          aria-labelledby="profile-positioned-button"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box p={1}>
            <Stack spacing={1}>
              {Profile_Menu.map((el) => (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleChangeTab(el.index);
                  }}
                >
                  <Stack
                    // onClick={el.title === "Logout" ? logOut() : ""}
                    sx={{ width: 100 }}
                    direction="row"
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <span>{el.title}</span>
                    {el.icon}
                  </Stack>{" "}
                </MenuItem>
              ))}
            </Stack>
          </Box>
        </Menu>
      </Stack>
    </>
  );
};

export default ProfileMenu;
