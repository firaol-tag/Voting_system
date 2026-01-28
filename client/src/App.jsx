import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";
import Vote from "./Pages/Vote";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import { useAuth } from "./Component/ContextAPI/Auth";

function App() {
  const { user, loading } = useAuth();

  const [nominees, setNominees] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      department: "Computer Science",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    },
    {
      id: 2,
      name: "Michael Lee",
      department: "Engineering",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
  ]);

  // deviceId stays same
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId =
      crypto?.randomUUID?.() ||
      Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard nominees={nominees} setNominees={setNominees} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
