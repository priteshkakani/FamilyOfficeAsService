import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import TaskModal from "../../components/dashboard/TaskModal";

export default function Tasks() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, tasks } = useClientData(userId);
  const [open, setOpen] = React.useState(false);

  if (loading) return <div data-testid="tasks-loading">Loading…</div>;

  return (
    <div data-testid="tasks-page">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Next Steps / Tasks</h2>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setOpen(true)} data-testid="add-task-btn">Add Task</button>
      </div>
      <div className="space-y-2">
        {(tasks || []).map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-3 flex justify-between items-center" data-testid={`task-item-${t.id}`}>
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">Due: {t.due_date}</div>
            </div>
            <div className="text-sm text-gray-500">{t.status}</div>
          </div>
        ))}
      </div>

      <TaskModal open={open} onClose={() => setOpen(false)} clientId={userId} />
    </div>
  );
}
import React from "react";

export default function Tasks() {
  return <div data-testid="page-tasks">Tasks page (placeholder)</div>;
}
import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import TaskModal from "../../components/dashboard/TaskModal";

export default function Tasks() {
  const { selectedClient } = useClient();
  const { loading, tasks, refresh } = useClientData(selectedClient);
  const [openTask, setOpenTask] = React.useState(false);
  const [taskPayload, setTaskPayload] = React.useState(null);

  React.useEffect(() => {
    const onAdd = (e) => {
      // open modal with prefilled payload
      setTaskPayload(e?.detail || null);
      setOpenTask(true);
    };
    window.addEventListener("task:add", onAdd);
    return () => window.removeEventListener("task:add", onAdd);
  }, [refresh]);

  return (
    <div data-testid="tasks-page">
      <h2 className="text-xl font-semibold mb-4">Next Steps / Tasks</h2>
      <div className="mb-4">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => setOpenTask(true)}
          data-testid="add-task-btn"
        >
          Add Task
        </button>
      </div>
      <div className="space-y-3">
        {(tasks || []).map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">Due: {t.due_date}</div>
            </div>
            <div className="text-sm text-gray-500">{t.status}</div>
          </div>
        ))}
      </div>

      <TaskModal
        open={openTask}
        onClose={(saved) => {
          setOpenTask(false);
          setTaskPayload(null);
          if (saved) refresh();
        }}
        clientId={selectedClient}
        task={taskPayload}
      />
    </div>
  );
}
