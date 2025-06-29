// src/components/UserTable.jsx
import React from "react";

const UserTable = ({ users, onPromote }) => {
  return (
    <div className="bg-white shadow rounded-md p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="w-full table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role}</td>
              <td className="p-2 space-x-2">
                {user.role !== "fact-checker" && (
                  <button
                    onClick={() => onPromote(user.id, "fact-checker")}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Make Fact-Checker
                  </button>
                )}
                {user.role !== "editor" && (
                  <button
                    onClick={() => onPromote(user.id, "editor")}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Make Editor
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
