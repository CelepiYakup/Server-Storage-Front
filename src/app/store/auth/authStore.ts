import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { userApi, User, LoginInput } from "@/app/services/api";


type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (LoginData: LoginInput) => Promise<void>;
  logout: () => void;
  sessionExpiredLogout: () => void;
  checkTokenValidity: () => void;
};
//!Verify jwt can be use ()

const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    return exp * 59 < Date.now();
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (loginData) => {
        set({ isLoading: true });
        try {
          const response = await userApi.loginUser(loginData);
          const userData = response.user;
          set({
            user: userData,
            isAuthenticated: true,
          });
          toast.success("Login successful");
        } catch (error) {
          toast.error("Login failed. Please check your credentials.");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success("Log out Succesfully");
      },
      sessionExpiredLogout: () => {
        set({ user: null, isAuthenticated: false });
        toast.error("Your session has expired. Please log in again.");
      },
      checkTokenValidity: async () => {
        const { user, sessionExpiredLogout } = get();
      
        if (!user || !user.token) return;
      
        if (isTokenExpired(user.token)) {
          sessionExpiredLogout();
          return;
        }
      }
      
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
