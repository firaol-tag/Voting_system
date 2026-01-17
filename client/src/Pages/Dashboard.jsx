import {useEffect, useState } from "react";
import DashNavbar from "../Component/DashNavbar";
import Sidebar from "../Component/Sidebar";
import axios from "axios";

const Dashboard = ({ nominees, setNominees }) => {
  const [view, setView] = useState("dashboard"); // dashboard, add, update
  const [votingActive, setVotingActive] = useState(true);

  // Add nominee form state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState("");

  // Update nominee form state
  const [selectedNomineeId, setSelectedNomineeId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newImage, setNewImage] = useState("");
  const [nomineesData,setNomineesData]=useState([])
 const handleAddNominee = (e) => {
  e.preventDefault();
  if (!name || !department || !image) return;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("department", department);
  formData.append("image", image); // MUST match upload.single("image")

  axios
    .post("http://localhost:3270/api/nominee/add", formData)
    .then((res) => {
            alert("Nominee added successfully!");
      setView("dashboard");
      setName("");
      setDepartment("");
      setImage("");

    })
    .catch((err) => {
      alert("Error adding nominee");
      console.error(err);
    });
};

  const handleUpdateNominee = (e) => {
    e.preventDefault();
    if (!selectedNomineeId) return;

    setNominees(
      nominees.map((nom) =>
        nom.id === parseInt(selectedNomineeId)
          ? {
              ...nom,
              name: newName || nom.name,
              department: newDepartment || nom.department,
              image: newImage || nom.image,
            }
          : nom
      )
    );

    setSelectedNomineeId("");
    setNewName("");
    setNewDepartment("");
    setNewImage("");
    alert("Nominee updated successfully!");
  };
const fetchNominees = async () => {
    await axios.get("http://localhost:3270/api/nominee/get")
    .then((res)=>{
      console.log(res.data.data);
      setNomineesData(res.data.data)
    })
    .catch((err)=>{
      console.log(err);
    });
}
useEffect(()=>{
  fetchNominees();
},[]);
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
          {view === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Current Nominees</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nomineesData.map((nom) => (
                  <div
                    key={nom.id}
                    className="bg-white rounded-xl shadow p-4 text-center"
                  >
                    <img
                      src={`http://localhost:3270${nom.photo}`}
                      alt={nom.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h3 className="font-bold text-lg">{nom.name}</h3>
                    <p className="text-gray-500">{nom.dep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "add" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Nominee</h2>
              <form onSubmit={handleAddNominee} className="space-y-4 max-w-md">
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

          {view === "update" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Update Nominee</h2>
              <form
                onSubmit={handleUpdateNominee}
                className="space-y-4 max-w-md"
              >
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={selectedNomineeId}
                  onChange={(e) => setSelectedNomineeId(e.target.value)}
                  required
                >
                  <option value="">Select Nominee</option>
                  {nominees.map((nom) => (
                    <option key={nom.id} value={nom.id}>
                      {nom.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="New Name"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="New Department"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="New Image URL"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Update Nominee
                </button>
              </form>
            </div>
          )}

          <div className="mt-6">
            <p className="text-gray-500">
              Voting is currently:{" "}
              <span className={votingActive ? "text-green-600" : "text-red-600"}>
                {votingActive ? "Active" : "Stopped"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
