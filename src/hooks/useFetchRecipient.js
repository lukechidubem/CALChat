import { useState, useEffect } from "react";
import axios from "../utils/axios";

const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  // const recipientId2 = chat.map((chat) => chat.members);
  // .find((id) => id !== user._id);
  // console.log("recipient2", recipientId2);

  // console.log("from useFetch", chats);

  const recipientId = chat?.members?.find((id) => id !== user._id);
  console.log("recipient", recipientId);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      await axios
        .get(
          `/api/users/find/${recipientId}`,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          setRecipientUser(response);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          // toast.error(error.response.data.message)
        });
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};

export default useFetchRecipientUser;
