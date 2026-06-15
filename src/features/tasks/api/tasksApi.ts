import { api } from "../../../shared/api/axios";
import { Task, TaskCompletion, VerificationType } from "../../../shared/types";

export interface CreateTaskPayload {
  title: string;
  description: string | null;
  xp_reward: number;
  verification_type: VerificationType;
  required_channel: string | null;
}

export const tasksApi = {
  create: async (eventId: number, payload: CreateTaskPayload): Promise<Task> => {
    const res = await api.post<Task>(`/tasks/event/${eventId}`, payload);
    return res.data;
  },

  getByEventId: async (eventId: number): Promise<Task[]> => {
    const res = await api.get<Task[]>(`/tasks/event/${eventId}`);
    return res.data;
  },

  getById: async (taskId: number): Promise<Task> => {
    const res = await api.get<Task>(`/tasks/${taskId}`);
    return res.data;
  },

  verify: async (taskId: number): Promise<TaskCompletion> => {
    const res = await api.post<TaskCompletion>(`/tasks/${taskId}/verify`);
    return res.data;
  },
};
