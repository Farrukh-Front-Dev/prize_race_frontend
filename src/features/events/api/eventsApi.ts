import { api } from "../../../shared/api/axios";
import { Event, EventStatus, Participant, LeaderboardEntry } from "../../../shared/types";

export interface CreateEventPayload {
  title: string;
  description: string | null;
  top_n_winners: number;
  total_prize_pool: string; // string representation of decimal
  start_date: string;
  end_date: string;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string | null;
  top_n_winners?: number;
  total_prize_pool?: string;
  start_date?: string;
  end_date?: string;
}

export const eventsApi = {
  create: async (payload: CreateEventPayload): Promise<Event> => {
    const res = await api.post<Event>("/events/", payload);
    return res.data;
  },

  list: async (params: { status?: EventStatus; skip?: number; limit?: number } = {}): Promise<Event[]> => {
    const res = await api.get<Event[]>("/events/", { params });
    return res.data;
  },

  getById: async (id: number): Promise<Event> => {
    const res = await api.get<Event>(`/events/${id}`);
    return res.data;
  },

  update: async (id: number, payload: UpdateEventPayload): Promise<Event> => {
    const res = await api.put<Event>(`/events/${id}`, payload);
    return res.data;
  },

  lock: async (id: number): Promise<Event> => {
    const res = await api.post<Event>(`/events/${id}/lock`);
    return res.data;
  },

  join: async (id: number): Promise<Participant> => {
    const res = await api.post<Participant>(`/events/${id}/join`);
    return res.data;
  },

  getLeaderboard: async (id: number, params: { limit?: number; offset?: number } = {}): Promise<LeaderboardEntry[]> => {
    const res = await api.get<LeaderboardEntry[]>(`/events/${id}/leaderboard`, { params });
    return res.data;
  },

  finish: async (id: number): Promise<Event> => {
    const res = await api.post<Event>(`/events/${id}/finish`);
    return res.data;
  },

  getWinners: async (id: number): Promise<LeaderboardEntry[]> => {
    const res = await api.get<LeaderboardEntry[]>(`/events/${id}/winners`);
    return res.data;
  },
};
