import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivityLogs } from "../api/activityAPi.js";

export default function ActivityLogs() {
  const { noteId } = useParams();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const res = await getActivityLogs(noteId);

        console.log("Logs response:", res.data); 

        setLogs(res.data.logs || []);
      } catch (err) {
        console.error("Logs error:", err);
        alert(err.response?.data?.message || "Failed to load logs");
      } finally {
        setLoading(false);
      }
    };

    if (noteId) fetchLogs();
  }, [noteId]);

  if (loading) return <p className="text-center mt-5">Loading logs...</p>;

  if (logs.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No activity found</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 col-md-8">
      <h3 className="mb-4">
        {" "}
        <span className="me-2">📊</span> Activity Logs
      </h3>

      <div className="list-group">
        {logs.map((log, index) => (
          <div
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <b>{log.username}</b> ({log.role}) →{" "}
              <span className="text-primary">{log.action}</span>
            </div>

            <small className="text-muted">
              {new Date(log.time).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
