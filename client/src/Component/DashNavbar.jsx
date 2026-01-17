import { Link } from "react-router-dom";

const DashNavbar = () => {
  return (
    <nav className="w-full fixed top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">
          🗳️ VoteApp
        </h1>

        <div className="space-x-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DashNavbar;
