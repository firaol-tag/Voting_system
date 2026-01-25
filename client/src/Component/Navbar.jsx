const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">
          Voting App
        </h1>
        {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Login
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
