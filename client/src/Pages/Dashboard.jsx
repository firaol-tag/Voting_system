import { useEffect, useState } from "react";
import DashNavbar from "../Component/DashNavbar";
import Sidebar from "../Component/Sidebar";
import API from "../Component/api";
import socket from "../Component/socket";

const Dashboard = () => {
  const [view, setView] = useState("dashboard");
  const [votingActive, setVotingActive] = useState(true);

  // nominee form
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [selectedNominee, setSelectedNominee] = useState(null);

  // admin form
  const [admName, setAdmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // data
  const [nomineesData, setNomineesData] = useState([]);
  const [votes, setVotes] = useState({});
  const [admins, setAdmins] = useState([]);

  /* ================= FETCH ================= */

  const fetchNominees = async () => {
    const res = await API.get("/api/nominee/get");
    setNomineesData(res.data.data || []);
  };

  const fetchVotes = async () => {
    const res = await API.get("/api/vote");
    const map = {};
    (res.data.data || []).forEach(v => {
      map[v.nominee_id] = v.totalVotes;
    });
    setVotes(map);
  };

  const fetchVotingStatus = async () => {
    const res = await API.get("/api/voting/status");
    setVotingActive(res.data.active);
  };

  const fetchAdmins = async () => {
    const res = await API.get("/api/user/get");
    setAdmins(res.data.data || []);
  };

  /* ================= ADMIN ================= */

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    await API.post("/api/user/register", {
      admName,
      email,
      password,
    });
    setAdmName("");
    setEmail("");
    setPassword("");
    fetchAdmins();
    setView("admins");
  };

  /* ================= NOMINEE ================= */

  const resetForm = () => {
    setName("");
    setDepartment("");
    setImage(null);
    setSelectedNominee(null);
  };

  const handleAddNominee = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("department", department);
    formData.append("image", image);

    await API.post("/api/nominee/add", formData);
    resetForm();
    fetchNominees();
    setView("dashboard");
  };

  const handleUpdateNominee = async (e) => {
    e.preventDefault();
    if (!selectedNominee) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("department", department);
    if (image) formData.append("image", image);

    await API.put(
      `/api/nominee/update/${selectedNominee.id}`,
      formData
    );

    resetForm();
    fetchNominees();
    setView("dashboard");
  };

  /* ================= VOTING ================= */

  const toggleVoting = async () => {
    console.log("request")
    const res = await API.post("/api/vote/status", {
      active: !votingActive,
    });
    setVotingActive(res.data.active);
    socket?.emit("votingStatusChanged", { active: res.data.active });
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchNominees();
    fetchVotes();
    fetchVotingStatus();
    fetchAdmins();

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

  const rankedNominees = [...nomineesData].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)
  );

  return (
    <>
      <DashNavbar />

      <div className="pt-24 flex">
<Sidebar
  setView={setView}
  votingActive={votingActive}
  toggleVoting={toggleVoting}
/>
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">

          {/* ================= DASHBOARD ================= */}
          {view === "dashboard" && (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setView("add")}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Nominee
                </button>

                <button
                  onClick={toggleVoting}
                  className={`px-4 py-2 rounded text-white ${
                    votingActive ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {votingActive ? "Stop Voting" : "Start Voting"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rankedNominees.map((nom, i) => (
                  <div
                    key={nom.id}
                    className={`bg-white p-4 rounded shadow ${
                      i === 0 ? "border-4 border-yellow-400" : ""
                    }`}
                  >
                    <img
                      src={
                        nom.photo && API.defaults.baseURL
                          ? `${API.defaults.baseURL}${nom.photo}`
                          : ""
                      }
                      className="h-40 w-full object-contain"
                      alt={nom.name}
                    />
                    <h3 className="font-bold">{nom.name}</h3>
                    <p>{nom.dep}</p>
                    <p className="font-bold text-purple-700">
                      Votes: {votes[nom.id] || 0}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedNominee(nom);
                        setName(nom.name);
                        setDepartment(nom.dep);
                        setView("update");
                      }}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= ADD NOMINEE ================= */}
          {view === "add" && (
            <form onSubmit={handleAddNominee} className="space-y-4 max-w-md">
              <h2 className="text-xl font-bold">Add Nominee</h2>
              <input className="w-full border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <input className="w-full border p-2" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
              <input type="file" onChange={e => setImage(e.target.files[0])} />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </form>
          )}

          {/* ================= UPDATE NOMINEE ================= */}
          {view === "update" && (
            <form onSubmit={handleUpdateNominee} className="space-y-4 max-w-md">
              <h2 className="text-xl font-bold">Update Nominee</h2>
              <input className="w-full border p-2" value={name} onChange={e => setName(e.target.value)} />
              <input className="w-full border p-2" value={department} onChange={e => setDepartment(e.target.value)} />
              <input type="file" onChange={e => setImage(e.target.files[0])} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </form>
          )}

          {/* ================= ADD ADMIN ================= */}
          {view === "addadmin" && (
            <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
              <h2 className="text-xl font-bold">Add Admin</h2>
              <input className="w-full border p-2" placeholder="Name" value={admName} onChange={e => setAdmName(e.target.value)} />
              <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Add Admin</button>
            </form>
          )}

{/* ================= ADMIN LIST ================= */}
{view === "admins" && (
  <div className="max-w-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Admins</h2>

      {/* ✅ FUNCTIONAL ADD ADMIN BUTTON */}
      <button
        onClick={() => setView("addadmin")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Admin
      </button>
    </div>

    {admins.length === 0 ? (
      <p className="text-gray-500">No admins found</p>
    ) : (
      <ul className="space-y-3">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="bg-white p-4 rounded shadow flex flex-col"
          >
            <span className="font-bold">{admin.name}</span>
            <span className="text-gray-600">{admin.email}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


        </div>
      </div>
    </>
  );
};

export default Dashboard;
