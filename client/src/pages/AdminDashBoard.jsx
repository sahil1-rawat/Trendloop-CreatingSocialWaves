import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import axios from 'axios';

const formatMonthlyData = (rawData) => {
  const map = {};
  rawData.forEach((item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    map[key] = item.count;
  });

  const result = [];
  const now = dayjs();

  for (let i = 11; i >= 0; i--) {
    const date = now.subtract(i, 'month');
    const key = `${date.year()}-${String(date.month() + 1).padStart(2, '0')}`;
    result.push({
      month: date.format('MMM YYYY'),
      count: map[key] || 0,
    });
  }

  return result;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SOCKET_URL}/api/admin/stats`,{
          withCredentials: true,
        });
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stats', err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;
  if (!stats) return <div className="text-center mt-10">No data available</div>;

  const monthlyUserGrowth = formatMonthlyData(stats.stats.monthlyUserGrowth);

  return (
    <div className="bg-gray-100 flex pb-16 p-6 flex-col">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{stats.stats.totalUsers}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Posts</h2>
          <p className="text-2xl">{stats.stats.totalPosts}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">New Signups (7 days)</h2>
          <p className="text-2xl">{stats.stats.newSignups}</p>
        </div>
      </div>

<div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Weekly User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.stats.userGrowth}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Monthly User Growth (Last 12 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyUserGrowth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Users</h2>
        <ul className="divide-y">
          {stats.recentUsers.map((user) => (
            <li key={user._id} className="py-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
