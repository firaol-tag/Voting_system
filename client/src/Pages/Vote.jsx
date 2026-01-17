import { useState } from "react";

const Vote = () => {
  const [email, setEmail] = useState("");
  const [nominee, setNominee] = useState("");
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !nominee) return;

  try {
    const res = await fetch("http://localhost:3000/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nominee_id: nominee.id, email, device_id: deviceId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setSubmitted(true);
    alert("✅ Vote recorded!");
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-700 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Cast Your Vote
        </h1>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ Thank you for voting!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Nominator Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Vote
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Vote;
