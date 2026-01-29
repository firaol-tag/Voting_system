import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
<h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
  5-Star Elevator
</h1>
          <ul className="flex flex-row items-center gap-4">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/nomineerank"}>Rank</NavLink>
        </ul>
      <h1 className="text-xl font-bold text-green-600">
          G-Power
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
