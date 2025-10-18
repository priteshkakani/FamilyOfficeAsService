import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { ClientProvider } from "../../hooks/useClientContext";
import GoalModal from "../../components/dashboard/GoalModal";
import TaskModal from "../../components/dashboard/TaskModal";

export default function DashboardShell() {
  const [openTask, setOpenTask] = React.useState(false);
  const [taskPayload, setTaskPayload] = React.useState(null);
  const [openGoal, setOpenGoal] = React.useState(false);
  const [goalPayload, setGoalPayload] = React.useState(null);

  React.useEffect(() => {
    const onAdd = (e) => {
      setTaskPayload(e?.detail || null);
      setOpenTask(true);
    };
    window.addEventListener("task:add", onAdd);
    return () => window.removeEventListener("task:add", onAdd);
  }, []);
  return (
    <ClientProvider>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modals mounted at shell so they can be triggered globally */}
      <TaskModal
        open={openTask}
        onClose={(saved) => {
          setOpenTask(false);
          setTaskPayload(null);
          if (saved) window.dispatchEvent(new Event("refresh-client-data"));
        }}
        clientId={
          null
        } /* TaskModal will rely on internal selected client via supabase policies or explicit props; pages can pass clientId when needed */
        task={taskPayload}
      />
      <GoalModal
        open={openGoal}
        onClose={(saved) => {
          setOpenGoal(false);
          setGoalPayload(null);
          if (saved) window.dispatchEvent(new Event("refresh-client-data"));
        }}
        clientId={null}
        goal={goalPayload}
      />
    </ClientProvider>
  );
}
