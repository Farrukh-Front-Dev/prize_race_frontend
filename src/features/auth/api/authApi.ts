import { api } from "../../../shared/api/axios";
import { User } from "../../../shared/types";

export interface RegisterPayload {
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const res = await api.post<User>("/auth/register", payload);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },

  updateMe: async (payload: { username?: string }): Promise<User> => {
    const res = await api.put<User>("/auth/me", payload);
    return res.data;
  },
};
