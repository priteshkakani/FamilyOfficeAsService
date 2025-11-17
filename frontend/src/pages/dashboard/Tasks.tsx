import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import TaskModal from "../../components/dashboard/TaskModal";
import { supabase } from "../../supabaseClient";
import { Plus, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [user?.id]);

  const handleTaskSave = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .upsert([
          { 
            ...task, 
            user_id: user.id 
          }
        ]);

      if (error) throw error;
      await fetchTasks();
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  if (loading) return <div className="p-4" data-testid="tasks-loading">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-600" data-testid="tasks-error">{error}</div>;

  return (
    <div className="p-4" data-testid="tasks-page">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          data-testid="add-task-button"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Add your first task to get started.
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              data-testid={`task-${task.id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
}
        task={taskPayload}
      />
    </div>
  );
}
