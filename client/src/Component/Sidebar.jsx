import React from "react";

const Sidebar = ({
  setView,
  votingActive,
  toggleVoting = () => {}
}) => {
  console.log(votingActive);
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-3">
        <li>
          <button
            onClick={() => setView("dashboard")}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </button>
        </li>

        <li>
          <button
            onClick={() => setView("add")}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            Add Nominee
          </button>
        </li>

        <li>
          <button
            onClick={() => setView("admins")}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
          >
            Admin Management
          </button>
        </li>

        {/* ✅ FIXED VOTING BUTTON */}
        <li>
          <button
            onClick={toggleVoting}
            className={`w-full text-left px-3 py-2 rounded ${
              votingActive ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {votingActive ? "Stop Voting" : "Start Voting"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
