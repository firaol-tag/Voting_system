import React, { useEffect, useState } from "react";
import API from "../Component/api";
import socket from "../Component/socket";

const NomineeRank = () => {
  const [nominees, setNominees] = useState([]);
  const [votes, setVotes] = useState({});
  const [votingActive, setVotingActive] = useState(false);

  // Fetch nominees
  const fetchNominees = async () => {
    const res = await API.get("/api/nominee/get");
    setNominees(res.data.data || []);
  };

  // Fetch votes
  const fetchVotes = async () => {
    const res = await API.get("/api/vote");
    const map = {};
    (res.data.data || []).forEach(v => {
      map[v.nominee_id] = v.totalVotes;
    });
    setVotes(map);
  };

  // Fetch voting status
  const fetchVotingStatus = async () => {
    const res = await API.get("/api/vote/status");
    setVotingActive(res.data.active);
    console.log(res.data.active);
  };

  useEffect(() => {
    fetchNominees();
    fetchVotes();
    fetchVotingStatus();

    if (socket) {
      socket.on("voteUpdate", fetchVotes);
      socket.on("votingStatusChanged", d =>
        setVotingActive(d.active)
      );
    }

    return () => {
      if (socket) {
        socket.off("voteUpdate");
        socket.off("votingStatusChanged");
      }
    };
  }, []);

  // Sort nominees by votes and assign rank
  const rankedNominees = [...nominees]
    .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)) // Sorting by votes
    .reduce((acc, nominee, idx, arr) => {
      const currentVoteCount = votes[nominee.id] || 0;
      // Find the rank for the nominee, and assign the same rank to those with the same vote count
      if (idx === 0 || currentVoteCount !== votes[arr[idx - 1].id]) {
        acc.push({ ...nominee, rank: idx + 1 });
      } else {
        acc.push({ ...nominee, rank: acc[idx - 1].rank });
      }
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white mt-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-white">
          Nominee Rankings
        </h1>
        <p className="text-gray-400 mt-2">Live voting results</p>
        <span
          className={`inline-block mt-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide
            ${
              votingActive
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }
          `}
        >
          {votingActive ? "VOTING ACTIVE" : "VOTING CLOSED"}
        </span>
      </div>

      {/* Ranked List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {rankedNominees.map((nom, index) => (
          <div
            key={nom.id}
            className="relative flex items-center justify-between bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 shadow-md hover:shadow-lg transition"
          >
            {/* Left Accent */}
            <div
              className={`absolute left-0 top-0 h-full w-1.5
                ${nom.rank === 1
                  ? "bg-yellow-400"
                  : nom.rank === 2
                  ? "bg-gray-400"
                  : nom.rank === 3
                  ? "bg-orange-400"
                  : "bg-purple-500"}
              `}
            />

            {/* Left Content */}
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg
                  ${nom.rank === 1
                    ? "bg-yellow-400 text-black"
                    : nom.rank === 2
                    ? "bg-gray-400 text-black"
                    : nom.rank === 3
                    ? "bg-orange-400 text-black"
                    : "bg-purple-600 text-white"}
                `}
              >
                {nom.rank}
              </div>

              {/* Profile Image */}
              <img
                src={
                  nom.photo && API.defaults.baseURL
                    ? `${API.defaults.baseURL}${nom.photo}`
                    : ""
                }
                alt={nom.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-700"
              />

              {/* Info */}
              <div>
                <p className="text-lg font-semibold">{nom.name}</p>
                <p className="text-sm text-gray-400">{nom.dep}</p>
              </div>
            </div>

            {/* Votes */}
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-400">Votes</p>
              <p className="text-2xl font-extrabold text-yellow-400">{votes[nom.id] || 0}</p>
              {nom.rank === 1 && (
                <p className="text-xs mt-1 text-yellow-300 font-semibold">Current Leader</p>
              )}
            </div>
          </div>
        ))}

        {rankedNominees.length === 0 && (
          <p className="text-center text-gray-500 mt-20">No nominees available</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500">
        Rankings update automatically in real time
      </div>
    </div>
  );
};

export default NomineeRank;
