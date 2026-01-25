import { useEffect, useState } from "react";
import NomineeCard from "../Component/NomineeCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3270");

const Home = () => {
  const [nomineesData, setNomineesData] = useState([]);
  const [votes, setVotes] = useState({});
  const [isVotingActive, setIsVotingActive] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  // Fetch nominees
  const fetchNominees = async () => {
    const res = await axios.get("http://localhost:3270/api/nominee/get");
    setNomineesData(res.data.data);
  };

  // Fetch votes and voting status
  const fetchVotesAndStatus = async () => {
    const resVotes = await axios.get("http://localhost:3270/api/vote");
    const voteMap = {};
    resVotes.data.data.forEach((v) => (voteMap[v.nominee_id] = v.totalVotes));
    setVotes(voteMap);

    const resStatus = await axios.get("http://localhost:3270/api/vote/status");
    setIsVotingActive(resStatus.data.active);
  };

  // Check if user has voted (localStorage)
  useEffect(() => {
    const email = localStorage.getItem("voterEmail");
    const deviceId = localStorage.getItem("voterDevice");
    if (email || deviceId) setHasVoted(true);
  }, []);

  // Initial fetch & socket listeners
  useEffect(() => {
    fetchNominees();
    fetchVotesAndStatus();

    socket.on("voteUpdate", fetchVotesAndStatus);
    socket.on("votingStatusChanged", (data) => setIsVotingActive(data.active));

    return () => {
      socket.off("voteUpdate");
      socket.off("votingStatusChanged");
    };
  }, []);

  const handleVote = (id) => {
    if (!isVotingActive) return alert("Voting is stopped by the admin.");
    if (hasVoted) return alert("You have already voted.");

    navigate(`/vote/${id}`);
  };

  const rankedNominees = [...nomineesData].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {!isVotingActive && (
          <div className="text-center mb-6 text-red-600 font-bold">
            Voting has been stopped by the admin.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {rankedNominees.map((nominee, index) => (
            <NomineeCard
              key={nominee.id}
              nominee={nominee}
              votes={votes[nominee.id] || 0}
              rank={index}
              onVote={() => handleVote(nominee.id)}
              disabled={!isVotingActive || hasVoted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
