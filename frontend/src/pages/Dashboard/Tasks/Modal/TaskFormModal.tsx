import { useState } from "react";
import { createTask } from "../../../../services/task.service";

export default function TaskFormModal({ onClose, reload, orgId }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as const,
    status: "TODO" as const
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!orgId) {
      setError("Organization not found. Please log in again.");
      return;
    }

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        organization_id: orgId
      });

      await reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Create Task</h3>

        {error ? <p className="form-error">{error}</p> : null}

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value as "LOW" | "MEDIUM" | "HIGH" })
          }
        >
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>

        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Creating..." : "Create"}
        </button>
        <button onClick={onClose} disabled={saving}>Cancel</button>

      </div>

    </div>
  );
}
