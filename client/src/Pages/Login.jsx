import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Component/ContextAPI/Auth";
import API from "../Component/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, loading,setLoading,login } = useAuth();
  const navigate = useNavigate();

const handleSubmit=async(e)=>{
  e.preventDefault()
  setLoading(true)
  try {
    await login({email,password})
    navigate("/dashboard")
  } catch (error) {
    console.log("login failed");
  }
  finally{
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Voting Admin Login
        </h2>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
