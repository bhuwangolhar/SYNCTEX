import { useEffect, useState } from "react";
import { getTasks } from "../../../services/task.service";
import { getStoredOrganizationId } from "../../../services/session.service";
import TaskTable from "./components/TaskTable";
import TaskFormModal from "./Modal/TaskFormModal";
import "../../../components/global/Task/team.css";

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [orgId, setOrgId] = useState("");

  const loadTasks = async () => {
    const resolvedOrgId = getStoredOrganizationId();

    setOrgId(resolvedOrgId);
    setLoading(true);

    if (!resolvedOrgId) {
      setTasks([]);
      setError("Organization not found. Please log in again to load team tasks.");
      setLoading(false);
      return;
    }

    try {
      const data = await getTasks(resolvedOrgId);
      setTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setTasks([]);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="team-container">

      <div className="team-header">
        <h2>Team Tasks</h2>
        <button disabled={!orgId} onClick={() => setShowModal(true)}>
          + Create Task
        </button>
      </div>

      {loading ? (
        <p className="team-info">Loading tasks...</p>
      ) : error ? (
        <p className="team-error">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No tasks yet</p>
      ) : (
        <TaskTable tasks={tasks} reload={loadTasks} />
      )}

      {showModal && (
        <TaskFormModal
          onClose={() => setShowModal(false)}
          reload={loadTasks}
          orgId={orgId}
        />
      )}

    </div>
  );
}
