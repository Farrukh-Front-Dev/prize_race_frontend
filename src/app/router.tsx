import { useNavigationStore } from "../shared/store/navigationStore";
import HomePage from "../pages/HomePage";
import EventDetailPage from "../pages/EventDetailPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import WinnersPage from "../pages/WinnersPage";
import CreateSprintPage from "../pages/CreateSprintPage";
import ManageTasksPage from "../pages/ManageTasksPage";
import DepositPage from "../pages/DepositPage";
import WalletPage from "../pages/WalletPage";

export function AppRouter() {
  const { page } = useNavigationStore();

  switch (page) {
    case "home":
      return <HomePage />;
    case "eventDetail":
      return <EventDetailPage />;
    case "leaderboard":
      return <LeaderboardPage />;
    case "winners":
      return <WinnersPage />;
    case "createSprint":
      return <CreateSprintPage />;
    case "manageTasks":
      return <ManageTasksPage />;
    case "deposit":
      return <DepositPage />;
    case "wallet":
      return <WalletPage />;
    default:
      return <HomePage />;
  }
}
export default AppRouter;
