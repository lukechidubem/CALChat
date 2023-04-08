import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {
    group_conversations: [],
    group_current_conversation: null,
    group_current_messages: [],
  },
};

const FormatDate = (date) => {
  const postDate = new Date(date);

  console.log(postDate.getDate());

  const currentDate = new Date();

  const timeDiff = Math.abs(currentDate.getTime() - postDate.getTime());
  const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

  const postedDate = () => {
    if (diffDays === 0 && postDate.getDate() == new Date().getDate()) {
      return "Today";
    } else if (
      diffDays === 1 ||
      (diffDays === 0 && postDate.getDate() !== new Date().getDate())
    ) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 14) {
      return "A week ago";
    } else if (diffDays <= 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays <= 60) {
      return "A month ago";
    } else if (diffDays <= 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };

  return postedDate();
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    //======================== For Individual Chats =========================
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );

        let lastMessage = el.messages[el.messages.length - 1];

        // console.log("last message", lastMessage);
        const time = FormatDate(
          lastMessage?.created_at ? lastMessage.created_at : Date.now()
        );
        return {
          id: el._id,
          user_id: user._id,
          //   name: `${user.firstName} ${user.lastName}`,
          name: user.name,
          online: user.status,
          img: faker.image.avatar(),
          msg: lastMessage?.text,
          time: `${time}`,
          unread: 0,
          pinned: false,
        };
      });

      state.direct_chat.conversations = list;
    },

    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user._id,
              name: user.name,
              //   name: `${user.firstName} ${user.lastName}`,
              online: user.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:00",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },

    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user._id,
        // name: `${user.firstName} ${user.lastName}`,
        name: user.name,
        online: user.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:00",
        unread: 0,
        pinned: false,
      });
    },

    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },

    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },

    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },

    //======================== For Group Chats =========================
    fetchDirectGroupConversations(state, action) {
      const list = action.payload.group_conversations.map((el) => {
        let lastMessage = el.messages[el.messages.length - 1];

        const time = FormatDate(
          lastMessage?.created_at ? lastMessage.created_at : Date.now()
        );

        return {
          id: el._id,
          group_id: el._id,
          // name: `${user.firstName} ${user.lastName}`,
          name: el.name,
          img: faker.image.avatar(),
          msg: lastMessage?.text,

          time: `${time}`,
          unread: 0,
        };
      });

      state.group_chat.group_conversations = list;

      console.log("List", list);
    },

    addDirectGroupConversation(state, action) {
      const this_conversation = action.payload.conversation;

      let lastMessage;

      for (let i = 0; i < this_conversation.messages.length; i++) {
        lastMessage = this_conversation.messages[this_conversation.length - 1];
      }

      // const group = this_conversation.participants.find(
      //   (elm) => elm._id.toString() !== user_id
      // );
      // state.group_chat.group_conversations = state.group_chat.group_conversations.filter(
      //   (el) => el.id !== this_conversation._id
      // );
      state.group_chat.group_conversations.push({
        id: this_conversation._id,
        group_id: this_conversation._id,
        // name: `${user.firstName} ${user.lastName}`,
        name: this_conversation.name,
        img: faker.image.avatar(),
        msg: lastMessage,
        time: "9:00",
        unread: 0,
        message: lastMessage,
      });
    },

    setCurrentGroupConversation(state, action) {
      state.group_chat.group_current_conversation = action.payload;
    },

    updateDirectGroupConversation(state, action) {
      const this_conversation = action.payload.conversation;

      state.group_chat.group_conversations =
        state.group_chat.group_conversations.map((el) => {
          if (el.id !== this_conversation._id) {
            return el;
          } else {
            let lastMessage;

            for (let i = 0; i < this_conversation.messages.length; i++) {
              lastMessage =
                this_conversation.messages[this_conversation.length - 1];
            }

            return {
              id: this_conversation._id._id,
              group_id: el._id,
              name: this_conversation.name,
              //   name: `${user.firstName} ${user.lastName}`,
              img: faker.image.avatar(),
              // msg: faker.music.songName(),
              msg: lastMessage,
              time: "9:00",
              unread: 0,
              pinned: false,
              message: lastMessage,
            };
          }
        });
    },

    fetchCurrentGroupMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
        sender: el.sender,
      }));

      state.group_chat.group_current_messages = formatted_messages;
    },

    addDirectGroupMessage(state, action) {
      state.group_chat.group_current_messages.push(action.payload.message);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};

export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  };
};

//======================== For Group Chats =========================
export const FetchDirectGroupConversations = ({ group_conversations }) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.fetchDirectGroupConversations({ group_conversations })
    );
  };
};

export const AddDirectGroupConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectGroupConversation({ conversation }));
  };
};

export const SetCurrentGroupConversation = (group_current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.setCurrentGroupConversation(group_current_conversation)
    );
  };
};

export const UpdateDirectGroupConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectGroupConversation({ conversation }));
  };
};

export const FetchCurrentGroupMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentGroupMessages({ messages }));
  };
};

export const AddDirectGroupMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectGroupMessage({ message }));
  };
};
