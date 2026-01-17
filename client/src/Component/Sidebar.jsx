import { useState } from "react";

const Sidebar = ({ setView, votingActive, setVotingActive }) => {
  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Admin</h1>

      <button
        onClick={() => setView("dashboard")}
        className="w-full text-left px-4 py-2 mb-2 rounded hover:bg-green-100 transition"
      >
        Dashboard
      </button>

      <button
        onClick={() => setView("add")}
        className="w-full text-left px-4 py-2 mb-2 rounded hover:bg-green-100 transition"
      >
        Add Nominee
      </button>

      <button
        onClick={() => setView("update")}
        className="w-full text-left px-4 py-2 mb-2 rounded hover:bg-green-100 transition"
      >
        Update Nominee
      </button>

      <button
        onClick={() => setVotingActive(!votingActive)}
        className={`w-full text-left px-4 py-2 mt-auto rounded ${
          votingActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
        } hover:opacity-90 transition`}
      >
        {votingActive ? "Stop Voting" : "Start Voting"}
      </button>
    </div>
  );
};

export default Sidebar;
