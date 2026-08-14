import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../../components/Navbar';

const SellerUsers = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample buyer/customer data for demonstration
  const [usersList] = useState([
    { id: 'usr_1', fullname: 'Eleanor Vance', email: 'eleanor@maison.com', role: 'buyer', status: 'Active', joined: '2026-01-15' },
    { id: 'usr_2', fullname: 'Julian Thorne', email: 'julian@maison.com', role: 'buyer', status: 'Active', joined: '2026-02-02' },
    { id: 'usr_3', fullname: 'Sophia Laurent', email: 'sophia@maison.com', role: 'buyer', status: 'VIP Buyer', joined: '2026-02-18' },
    { id: 'usr_4', fullname: 'Alexander Hayes', email: 'alex@maison.com', role: 'buyer', status: 'Active', joined: '2026-03-10' },
    { id: 'usr_5', fullname: 'Clara Oswald', email: 'clara@maison.com', role: 'buyer', status: 'Inactive', joined: '2026-04-01' },
  ]);

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="px-6 py-10 sm:px-8 lg:px-10 md:ml-64">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">Users & Customers</h1>
            <p className="mt-2 text-sm font-light text-gray-500">
              Overview of buyer accounts, customer activity, and storefront membership.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-light">Total Buyers</span>
              <p className="text-3xl font-light text-gray-900">128</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-light">Active Sessions</span>
              <p className="text-3xl font-light text-gray-900">42</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-1">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-light">VIP Members</span>
              <p className="text-3xl font-light text-gray-900">18</p>
            </div>
          </div>

          {/* Search & User List Table */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-light text-gray-900">Registered Accounts</h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full rounded-xl border border-gray-200 bg-neutral-50 py-2.5 pl-4 pr-10 text-xs font-light text-gray-900 focus:border-black focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[10px]">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 px-4 font-normal text-gray-900">{item.fullname}</td>
                      <td className="py-4 px-4 text-gray-500">{item.email}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-wider text-gray-600">
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] ${
                          item.status === 'Active' || item.status === 'VIP Buyer' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">{item.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerUsers;
