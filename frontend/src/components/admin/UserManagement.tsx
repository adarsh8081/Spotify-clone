import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="bg-[#121212] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#282828]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828]">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-[#1a1a1a]">
                <td className="px-6 py-4 text-sm text-white">{user.username}</td>
                <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                <td className="px-6 py-4 text-sm text-white">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                    className="bg-[#282828] text-white rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 