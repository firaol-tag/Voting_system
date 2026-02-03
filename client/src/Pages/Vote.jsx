import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

const Vote = () => {
  const { id } = useParams(); // nominee_id
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(true);

  useEffect(() => {
    // FingerprintJS for device ID
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    loadFingerprint();

    // Fetch voting status
    axios
      .get("https://backdressingvote.gpower-et.com/api/vote/status")
      .then((res) => setIsVotingActive(res.data.active))
      .catch(() => setIsVotingActive(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVotingActive) return alert("Voting is stopped by admin.");
    if (!email || !deviceId) return;

    setLoading(true);
    try {
      const res = await axios.post("https://backdressingvote.gpower-et.com/api/vote", {
        nominee_id: id,
        email,
        device_id: deviceId,
      });

      // Mark as voted in localStorage to disable all vote buttons
      localStorage.setItem("voterEmail", email);
      localStorage.setItem("voterDevice", deviceId);

      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isVotingActive) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold">
          Voting is currently stopped by the admin.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            {loading ? "Submitting..." : "Submit Vote"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Vote;
