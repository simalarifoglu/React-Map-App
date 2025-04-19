import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import "./AnalyticsPanel.css";

const COLORS = ["#b8503b", "#f4a896", "#d3846f", "#a33b2a"];

const AnalyticsPanel = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    adminCount: 0,
    pointCount: 0,
    lineCount: 0,
    polygonCount: 0,
    objectCount: 0
  });

  const fetchStats = () => {
    fetch("https://localhost:7176/api/Auth/stats", { credentials: "include" })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error("Veriler alınamadı:", err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    { name: "Points", value: data.pointCount },
    { name: "Linestrings", value: data.lineCount },
    { name: "Polygons", value: data.polygonCount }
  ];

  const renderLabelWithLine = ({ cx, cy, midAngle, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fill="#712f2f"
        fontSize={13}
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  return (
    <div className="analytics-panel">
      <div className="analytics-header">
        <h2 className="analytics-title">Admin Analytics</h2>
        <button className="refresh-button" onClick={fetchStats} title="Refresh">
          <svg className="refresh-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M500.33 93.66c12.5-12.5 12.5-32.76 0-45.26s-32.76-12.5-45.26 0l-59.6 59.6C361.24 82.29 311.82 64 256 64 
              132.29 64 32 164.29 32 288s100.29 224 224 224c94.59 0 178.1-58.59 209.47-144.29 
              6.06-16.52-2.54-34.78-19.06-40.84s-34.78 2.54-40.84 19.06C384.94 404.28 324.59 
              448 256 448c-88.37 0-160-71.63-160-160S167.63 128 256 128c37.42 0 71.87 13.1 98.97 
              34.91l-63.1 63.1c-20.15 20.15-5.88 54.62 22.63 54.62H464c17.67 0 32-14.33 32-32V118.63c0-28.51-34.47-42.78-54.62-22.63z"
              fill="#b8503b"
            />
          </svg>
        </button>
      </div>

      <div className="analytics-boxes">
        <div className="analytics-box"><h3>Total Users</h3><p>{data.totalUsers}</p></div>
        <div className="analytics-box"><h3>Admin Count</h3><p>{data.adminCount}</p></div>
      </div>

      <div className="analytics-boxes">
        <div className="analytics-box"><h3>Total Points</h3><p>{data.pointCount}</p></div>
        <div className="analytics-box"><h3>Total Linestrings</h3><p>{data.lineCount}</p></div>
        <div className="analytics-box"><h3>Total Polygons</h3><p>{data.polygonCount}</p></div>
        <div className="analytics-box"><h3>Total Objects</h3><p>{data.objectCount}</p></div>
      </div>
      
      <div className="chart-wrapper">

        <div className="chart-pie">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderLabelWithLine}
                labelLine
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ marginTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
