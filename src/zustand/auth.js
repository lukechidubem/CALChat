import { create } from "zustand";
import axios from "../utils/axios";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      token: "",
      isLoading: false,

      loginUser: async (formValues) => {
        await axios
          .post(
            "/api/users/login",
            {
              ...formValues,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const state = get();
            state.isLoggedIn = true;
            set({
              isLoggedIn: true,
              token: response.data.token,
              isLoading: false,
            });
          })
          .catch((error) => console.log(error));
      },

      logOut: () => {
        set({
          isLoggedIn: false,
          token: "",
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
    }
  )
);

export default useAuthStore;
