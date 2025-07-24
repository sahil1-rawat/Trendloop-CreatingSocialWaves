import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id) => {
    try {
      const res = await axios.patch(`/api/admin/${id}/ban`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBanned: res.data.isBanned } : user
        )
      );
      setSelectedUser(null);
      fetchUsers(); // Close dialog after action
    } catch (err) {
      console.error('Error toggling ban:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-16">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

      <input
        type="text"
        placeholder="Search users by name or email..."
        className="w-full md:w-1/3 px-4 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Gender</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 capitalize">{user.gender}</td>
                    <td className="py-3 px-4">
                      {user.isAdmin ? (
                        <span className="text-green-600 font-semibold">Admin</span>
                      ) : user.isBanned ? (
                        <span className="text-red-500 font-semibold">Banned</span>
                      ) : (
                        <span className="text-blue-600 font-semibold">User</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {!user.isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className={`${
                                user.isBanned
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-red-500 hover:bg-red-600'
                              } text-white w-20 py-1 rounded`}
                              onClick={() => setSelectedUser(user)}
                            >
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.isBanned ? 'Unban User?' : 'Ban User?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to {user.isBanned ? 'unban' : 'ban'}{' '}
                                <strong>{user.name}</strong>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleToggleBan(user._id)}>
                                {user.isBanned ? 'Unban' : 'Ban'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
