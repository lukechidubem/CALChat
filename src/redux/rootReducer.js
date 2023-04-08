import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import chatReducer from "./slices/chat";
import userReducer from "./slices/users";
import conversationReducer from "./slices/conversation";
import audioCallReducer from "./slices/audioCall";
import videoCallReducer from "./slices/videoCall";

// slices

const rootPeristConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist: [],
  // blacklist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  chat: chatReducer,
  users: userReducer,
  conversation: conversationReducer,
  audioCall: audioCallReducer,
  videoCall: videoCallReducer,
});

export { rootPeristConfig, rootReducer };
