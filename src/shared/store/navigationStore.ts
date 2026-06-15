import { create } from "zustand";

export type Page =
  | "home"
  | "eventDetail"
  | "leaderboard"
  | "winners"
  | "createSprint"
  | "manageTasks"
  | "deposit"
  | "wallet";

interface NavigationState {
  page: Page;
  selectedEventId: number | null;
  history: { page: Page; selectedEventId: number | null }[];
  navigate: (page: Page, selectedEventId?: number | null) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  page: "home",
  selectedEventId: null,
  history: [],
  navigate: (page, selectedEventId = null) => {
    const current = { page: get().page, selectedEventId: get().selectedEventId };
    set({
      page,
      selectedEventId,
      history: [...get().history, current],
    });
  },
  goBack: () => {
    const history = get().history;
    if (history.length > 0) {
      const prev = history[history.length - 1];
      set({
        page: prev.page,
        selectedEventId: prev.selectedEventId,
        history: history.slice(0, -1),
      });
    } else {
      set({ page: "home", selectedEventId: null });
    }
  },
}));
