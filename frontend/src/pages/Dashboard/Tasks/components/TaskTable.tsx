import { deleteTask } from "../../../../services/task.service";

export default function TaskTable({ tasks, reload }: any) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const getStatusColor = (status: string) => {
    if (status === "DONE") return "green";
    if (status === "IN_PROGRESS") return "orange";
    return "gray";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "HIGH") return "red";
    if (priority === "MEDIUM") return "blue";
    return "gray";
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {safeTasks.map((t: any) => (
          <tr key={t.id}>
            <td>{t.title}</td>

            <td>
              <span className={`badge ${getStatusColor(t.status)}`}>
                {t.status}
              </span>
            </td>

            <td>
              <span className={`badge ${getPriorityColor(t.priority)}`}>
                {t.priority}
              </span>
            </td>

            <td>{t.due_date || "-"}</td>

            <td>
              <button
                className="delete-btn"
                onClick={async () => {
                  if (confirm("Delete this task?")) {
                    await deleteTask(t.id);
                    reload();
                  }
                }}
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
}
