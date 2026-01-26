import { useEffect, useState } from "react";
import DashNavbar from "../Component/DashNavbar";
import Sidebar from "../Component/Sidebar";
import API from "../Component/api";
import socket from "../Component/socket";

const Dashboard = () => {
  const [view, setView] = useState("dashboard");
  const [votingActive, setVotingActive] = useState(true);

  // Nominee form state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);

  const [nomineesData, setNomineesData] = useState([]);
  const [votes, setVotes] = useState({});
  //add admin
  const handleAddAdmin = async ({name, email, password}) => {
    try {
      await API.post("/api/user/add", { name, email, password });
      alert("Admin added successfully");
    } catch (err) {
      alert("Error adding admin");
      console.error(err);
    }
  };
  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await API.get("/api/admin/get");
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch nominees
  const fetchNominees = async () => {
    try {
      const res = await API.get("/api/nominee/get");
      setNomineesData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch votes
  const fetchVotes = async () => {
    try {
      const res = await API.get("/api/vote");
      const map = {};
      res.data.data.forEach((v) => {
        map[v.nominee_id] = v.totalVotes;
      });
      setVotes(map);
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch voting status
  const fetchVotingStatus = async () => {
    try {
      const res = await API.get("/api/voting/status");
      setVotingActive(res.data.active);
    } catch (err) {
      console.error(err);
    }
  };
  // Add nominee
  const handleAddNominee = async (e) => {
    e.preventDefault();
    if (!name || !department || !image) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("department", department);
    formData.append("image", image);

    try {
      await API.post("/api/nominee/add", formData);
      alert("Nominee added successfully");
      setName("");
      setDepartment("");
      setImage(null);
      setView("dashboard");
      fetchNominees();
    } catch (err) {
      alert("Error adding nominee");
      console.error(err);
    }
  };
  // Toggle voting
  const toggleVoting = async () => {
    try {
      const res = await API.post("/api/vote/status", {
        active: !votingActive,
      });
      setVotingActive(res.data.active);

      // Emit WebSocket event
      socket.emit("votingStatusChanged", { active: res.data.active });
    } catch (err) {
      console.error(err);
    }
  };
  // Ranking logic
  const rankedNominees = [...nomineesData].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)
  );
  // Initial fetch & socket listeners
  useEffect(() => {
    fetchNominees();
    fetchVotes();
    fetchVotingStatus();
    fetchAdmins
    socket.on("voteUpdate", fetchVotes);
    socket.on("votingStatusChanged", (data) =>
      setVotingActive(data.active)
    );

    return () => {
      socket.off("voteUpdate");
      socket.off("votingStatusChanged");
    };
  }, []);

  return (
    <>
      <DashNavbar />
      <div className="pt-24 flex">
        <Sidebar
          setView={setView}
          votingActive={votingActive}
          setVotingActive={setVotingActive}
        />

        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          {/* DASHBOARD VIEW */}
          {view === "dashboard" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Current Nominees</h2>

                <button
                  onClick={toggleVoting}
                  className={`py-2 px-4 rounded-lg font-semibold transition ${
                    votingActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {votingActive ? "Stop Voting" : "Start Voting"}
                </button>
              </div>

              <p className="text-gray-700 font-medium mb-4">
                Voting Status:{" "}
                <span
                  className={votingActive ? "text-green-600" : "text-red-600"}
                >
                  {votingActive ? "ACTIVE" : "STOPPED"}
                </span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rankedNominees.map((nom, index) => (
                  <div
                    key={nom.id}
                    className={`relative bg-white rounded-xl shadow p-4 text-center transition-all ${
                      index === 0 ? "border-4 border-yellow-400 scale-105" : ""
                    }`}
                  >
                    <img
                      src={`${API.defaults.baseURL}${nom.photo}`} // <-- dynamic IP
                      alt={nom.name}
                      className="w-full h-40 object-contain rounded mb-2"
                    />

                    <h3 className="font-bold text-lg">{nom.name}</h3>
                    <p className="text-gray-500">{nom.dep}</p>
                    <p className="mt-2 text-lg font-bold text-purple-700">
                      {votes[nom.id] || 0} votes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD NOMINEE VIEW */}
          {view === "add" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Nominee</h2>
              <form
                onSubmit={handleAddNominee}
                className="space-y-4 max-w-md"
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <input
                  type="file"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Add Nominee
                </button>
              </form>
            </div>
          )}
          {/* UPDATE NOMINEE */}
          {view === "update" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Update Nominee</h2>
              <form
                onSubmit={handleAddNominee}
                className="space-y-4 max-w-md"
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
                <input
                  type="file"
                  className="w-full px-4 py-2 border rounded-lg"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Nominee
                </button>
              </form>
            </div>
          )}
          {/* ADD ADMIN VIEW */}
          {view === "addAdmin" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Admin</h2>
              <form
                onSubmit={handleAddAdmin}
                className="space-y-4 max-w-md"
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Add Admin
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
