import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/dashboard/Topbar";
import SubTabs from "../components/SubTabs";
import TopNav from "../components/TopNav";

export default function DashboardShell() {
  const location = useLocation();
  // Determine section from path
  const section =
    ["overview", "portfolio", "plan", "activity", "transactions"].find((s) =>
      location.pathname.includes(s)
    ) || "overview";
  console.log('Current section:', section, 'Path:', location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-50 w-full">
          <Topbar />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="sticky top-16 z-40 w-full">
            <TopNav />
          </div>
          <div className="sticky top-28 z-30 w-full">
            <SubTabs section={section} />
          </div>
          <main className="p-6 relative z-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
