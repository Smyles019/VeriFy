// src/components/ApplicationTable.jsx
import React from "react";

const ApplicationTable = ({ applications, onDecision }) => {
  return (
    <div className="bg-white shadow rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4">Reporter Applications</h2>
      <table className="w-full table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{app.name}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.reason}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onDecision(app.id, "approved")}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => onDecision(app.id, "rejected")}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
