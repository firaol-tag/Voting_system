import { useEffect, useState } from "react"; 
import NomineeCard from "../Component/NomineeCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../Component/ContextAPI/Auth";

const socket = io("https://backdressingvote.gpower-et.com");

const Home = () => {
   const {url}=useAuth()
  const [nomineesData, setNomineesData] = useState([]);
  const [votes, setVotes] = useState({});
  const [isVotingActive, setIsVotingActive] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  // Fetch nominees
  const fetchNominees = async () => {
    try {
      const res = await axios.get(url+"/api/nominee/get");
      setNomineesData(res.data.data);
    } catch (error) {
      console.error("Error fetching nominees:", error);
    }
  };

  // Fetch votes and voting status
  const fetchVotesAndStatus = async () => {
    try {
      const resVotes = await axios.get(url +"/api/vote");
      const voteMap = {};
      resVotes.data.data.forEach((v) => (voteMap[v.nominee_id] = v.totalVotes));
      setVotes(voteMap);
    
      const resStatus = await axios.get(url +"/api/vote/status");
      setIsVotingActive(resStatus.data.active);
      console.log(resStatus.data.active);
    } catch (error) {
      console.error("Error fetching votes or status:", error);
    }
  };
  const fetchVoteWithDeviceId = async () => {
    try {
      const deviceId = localStorage.getItem("voterDevice");
      if (deviceId) {
        const res = await axios.get(`https://backdressingvote.gpower-et.com/api/vote/device/${deviceId}`);
        setHasVoted(res.data.hasVoted);
      }
    } catch (error) {
      console.error("Error fetching vote with device ID:", error);
    }
  };

  // Check if user has voted (localStorage only)
  useEffect(() => {
    const email = localStorage.getItem("voterEmail");
    const deviceId = localStorage.getItem("voterDevice");

    // Only set hasVoted if BOTH email && deviceId exist
    if (email && deviceId) {
      setHasVoted(true);
    } else {
      setHasVoted(false);
    }
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
    if (!isVotingActive) {
      alert("Voting is stopped by the admin.");
      return;
    }
    if (hasVoted) {
      alert("You have already voted.");
      return;
    }

    navigate(`/vote/${id}`);
  };

  const rankedNominees = [...nomineesData].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 px-6">
      <div className="text-center font-extrabold text-white text-2xl md:text-4xl lg:text-5xl mb-16 mt-6">
        <h2>Best Dressing Nominee 2026</h2>
      </div>

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
