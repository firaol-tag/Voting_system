import { Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Vote from "./Pages/Vote";
import React from "react";
import Navbar from "./Component/Navbar";
import Dashboard from "./Pages/Dashboard";
import { useState } from "react";
function App() {
   const [nominees, setNominees] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      department: "Computer Science",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    },
    {
      id: 2,
      name: "Michael Lee",
      department: "Engineering",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
  ]);
  let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
  const deviceId =
  crypto?.randomUUID?.() ||
  Math.random().toString(36).substring(2) + Date.now();
  localStorage.setItem("deviceId", deviceId);
}

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote/:id" element={<Vote />} />
         <Route
          path="/dashboard"
          element={<Dashboard nominees={nominees} setNominees={setNominees} />}
        />
      </Routes>
    </>
  );
}

export default App;
