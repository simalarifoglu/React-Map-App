import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMainPanel.css";

const LogsPanel = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("https://localhost:7176/api/Auth/logs", { withCredentials: true })
            .then(res => {
                setLogs(res.data.value || []);
            })
            .catch(err => {
                console.error("Log fetch error:", err);
            });
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesAction = filter
            ? log.actionType.toLowerCase() === filter
            : true;

        const matchesSearch = searchQuery
            ? log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.objectType.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesAction && matchesSearch;
    });

    const groupedLogs = filteredLogs.reduce((groups, log) => {
        const date = new Date(log.actionTime).toLocaleDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(log);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="logs-panel">
            <h2>Latest User Actions</h2>

            <div className="logs-controls">
                <input
                    type="text"
                    placeholder="Search by user or object..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Actions</option>
                    <option value="Add">Add</option>
                    <option value="Update">Update</option>
                    <option value="Delete">Delete</option>
                </select>
            </div>

            {sortedDates.map(date => (
                <div key={date}>
                    <h4 style={{ marginTop: "20px" }}>{date}</h4>
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Object Type</th>
                                <th>Object Name</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedLogs[date].map((log, index) => (
                                <tr key={index}>
                                    <td>{log.username}</td>
                                    <td>{log.actionType}</td>
                                    <td>{log.objectType}</td>
                                    <td>{log.objectName}</td>
                                    <td>{new Date(log.actionTime).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default LogsPanel;