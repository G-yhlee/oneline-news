import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  isAnonymous: number;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  total: number;
  anonymous: number;
  oauth: number;
  verified: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'anonymous' | 'oauth'>('all');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    image: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [API_URL]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = `${API_URL}/users`;
      if (filter === 'anonymous') endpoint = `${API_URL}/users/anonymous`;
      if (filter === 'oauth') endpoint = `${API_URL}/users/oauth`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filter, API_URL]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchStats, fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('User deleted successfully');
        fetchUsers();
        fetchStats();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  const handleCleanupAnonymous = async () => {
    if (!confirm('Are you sure you want to delete all anonymous users?')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/cleanup/anonymous`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`${data.message}`);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.error || 'Failed to cleanup anonymous users');
      }
    } catch (error) {
      alert('Failed to cleanup anonymous users');
      console.error('Cleanup error:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      image: user.image || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      
      if (data.success) {
        alert('User updated successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      alert('Failed to update user');
      console.error('Update user error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
              
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Users</div>
                    <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">OAuth Users</div>
                    <div className="text-2xl font-bold text-green-900">{stats.oauth}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Anonymous Users</div>
                    <div className="text-2xl font-bold text-yellow-900">{stats.anonymous}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Verified Users</div>
                    <div className="text-2xl font-bold text-purple-900">{stats.verified}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setFilter('oauth')}
                    className={`px-4 py-2 rounded-md ${
                      filter === 'oauth' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    OAuth Users
                  </button>
                  <button
                    onClick={() => setFilter('anonymous')}
                    className={`px-4 py-2 rounded-md ${
                      filter === 'anonymous' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Anonymous Users
                  </button>
                </div>
                
                <button
                  onClick={handleCleanupAnonymous}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cleanup Anonymous Users
                </button>
              </div>

              {loading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
              
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Verified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.image ? (
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                  <Image 
                                    src={user.image} 
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isAnonymous 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.isAnonymous ? 'Anonymous' : 'OAuth'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.emailVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}