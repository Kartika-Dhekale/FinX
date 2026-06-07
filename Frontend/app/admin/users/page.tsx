'use client';

import { useEffect, useState } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';

import { api } from '@/lib/api';

export default function UsersPage() {
  const exportCSV = () => {
  const headers = ['Name', 'Email', 'Role'];

  const rows = users.map((user: any) => [
    user.name,
    user.email,
    user.role,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;

  link.setAttribute('download', 'users_export.csv');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
  try {
    const data = await api.get('/admin/users');

    setUsers(data); // ✅ direct array
  } catch (error) {
    console.error('Error loading users:', error);
  } finally {
    setLoading(false);
  }
};
  const deleteUser = async (id: string) => {
    try {

      await api.delete(`/admin/users/${id}`);

      loadUsers();

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#08111F] text-white flex">

      <AdminSidebar />

      <div className="ml-[260px] w-full p-8">

        <h1 className="text-4xl font-bold mb-8">
          Users Management
        </h1>
        <div className="flex justify-between items-center mb-6">



  <button
    onClick={exportCSV}
    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl transition-all"
  >
    Export CSV
  </button>

</div>

        {loading ? (

          <div>Loading...</div>

        ) : (

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">

            <table className="w-full">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="p-5">
                    Name
                  </th>

                  <th className="p-5">
                    Email
                  </th>

                  <th className="p-5">
                    Role
                  </th>

                  <th className="p-5">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user: any) => (

                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >

                    <td className="p-5">
                      {user.name}
                    </td>

                    <td className="p-5">
                      {user.email}
                    </td>

                    <td className="p-5">
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                        {user.role}
                      </span>
                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          deleteUser(user._id)
                        }
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all"
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
  );
}