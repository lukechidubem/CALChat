import { faker } from "@faker-js/faker";
import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
// import StyledBadge from "./StyledBadge";
import { styled, useTheme } from "@mui/material/styles";
import useFetchRecipientUser from "../hooks/useFetchRecipient";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar src={faker.image.avatar()} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;

export const ChatElement2 = ({ chat, user }) => {
  // console.log(chat);
  // console.log("user", user);

  const { recipientUser } = useFetchRecipientUser(chat, user);

  // console.log(recipientUser);

  const theme = useTheme();
  return (
    // <div>Userchat</div>

    <Box
      sx={{
        width: "100%",

        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
    >
      {recipientUser && (
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            {recipientUser.data.verified ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={faker.image.avatar()} />
              </StyledBadge>
            ) : (
              // <Avatar src={faker.image.avatar()} />
              <Avatar src={recipientUser.data.photo} />
            )}

            <Stack spacing={0.3}>
              <Typography variant="subtitle2">
                {recipientUser.data.name}
              </Typography>
              <Typography variant="caption">{`Hey ${recipientUser.data.name} we are testing`}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} alignItems="center">
            <Typography sx={{ fontWeight: 600 }} variant="caption">
              {"6:30"}
            </Typography>
            <Badge color="primary" badgeContent={4}></Badge>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export const UsersChatElement = ({ chat, onclick }) => {
  const theme = useTheme();
  return (
    // <div>Userchat</div>

    <Box
      sx={{
        width: "100%",

        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
      onClick={onclick}
    >
      {chat && (
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            {chat.verified ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar src={faker.image.avatar()} />
              </StyledBadge>
            ) : (
              // <Avatar src={faker.image.avatar()} />
              <Avatar src={chat.photo} />
            )}

            <Stack spacing={0.3}>
              <Typography variant="subtitle2">{chat.name}</Typography>
              <Typography variant="caption">{`Hey ${chat.name} we are testing`}</Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} alignItems="center">
            <Typography sx={{ fontWeight: 600 }} variant="caption">
              {"6:30"}
            </Typography>
            <Badge color="primary" badgeContent={4}></Badge>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
