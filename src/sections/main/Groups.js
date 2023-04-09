import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { MagnifyingGlass } from "phosphor-react";
import { CallElement } from "../../components/CallElement";
import { CallList } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchGroups,
  FetchUserGroups,
  FetchUserOwnGroups,
} from "../../redux/slices/users";
import { GetUsers } from "../../redux/slices/users";

import { GroupElement, UserGroupElement } from "../../components/GroupElement";
import useResponsive from "../../hooks/useResponsive";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GroupList = ({ handleClose }) => {
  const dispatch = useDispatch();

  const { all_group_chats } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(FetchGroups());
  }, []);

  return (
    <>
      {all_group_chats.map((el, idx) => {
        return <GroupElement key={idx} {...el} handleClose={handleClose} />;
      })}
    </>
  );
};

const UserGroupList = ({ handleClose }) => {
  const dispatch = useDispatch();

  const { user_group_chats } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(FetchUserGroups());
  }, []);

  return (
    <>
      {user_group_chats.map((el, idx) => {
        return <UserGroupElement key={idx} {...el} handleClose={handleClose} />;
      })}
    </>
  );
};

const UserOwnGroupList = ({ handleClose }) => {
  const dispatch = useDispatch();

  const { user_own_group_chats } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(FetchUserOwnGroups());
  }, []);

  return (
    <>
      {user_own_group_chats.map((el, idx) => {
        return <UserGroupElement key={idx} {...el} handleClose={handleClose} />;
      })}
    </>
  );
};

const Groups = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const isDesktop = useResponsive("up", "md");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: isDesktop ? 4 : 2 }}
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={isDesktop ? 2 : 1} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="New Groups" />
          <Tab label="User Groups" />
          <Tab label="Own Groups" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={isDesktop ? 2.4 : 1.4}>
            {(() => {
              switch (value) {
                case 0:
                  return <GroupList handleClose={handleClose} />;

                case 1:
                  return <UserGroupList handleClose={handleClose} />;

                case 2:
                  return <UserOwnGroupList handleClose={handleClose} />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Groups;
