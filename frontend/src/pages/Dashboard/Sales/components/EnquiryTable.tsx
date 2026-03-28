import { deleteEnquiry, updateEnquiry } from "../../../../services/enquiry.service";

export default function EnquiryTable({ data, reload }: any) {
  const safeData = Array.isArray(data) ? data : [];

  const changeStatus = async (id: string, status: string) => {
    await updateEnquiry(id, { status });
    reload();
  };

  const getStatusColor = (status: string) => {
    if (status === "NEW") return "enquiry-blue";
    if (status === "CONTACTED") return "enquiry-orange";
    return "enquiry-green";
  };

  return (
    <table className="enquiry-table">

      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Message</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {safeData.map((e: any) => (
          <tr key={e.id}>
            <td>{e.name}</td>

            <td>
              {e.email}<br />
              {e.phone}
            </td>

            <td>{e.message}</td>

            <td>
              <select
                className={`enquiry-badge ${getStatusColor(e.status)}`}
                value={e.status}
                onChange={(ev) =>
                  changeStatus(e.id, ev.target.value)
                }
              >
                <option>NEW</option>
                <option>CONTACTED</option>
                <option>CLOSED</option>
              </select>
            </td>

            <td>
              <button
                className="enquiry-delete-btn"
                onClick={async () => {
                  if (confirm("Delete enquiry?")) {
                    await deleteEnquiry(e.id);
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
