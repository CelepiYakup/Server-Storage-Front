import { useAuthStore } from "../store/auth/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const { user } = useAuthStore.getState();

  const token = user?.token;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
  created_at: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  loginUser: async (
    loginData: LoginInput
  ): Promise<{ message: string; user: User & { token: string } }> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      return await response.json();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },
};
