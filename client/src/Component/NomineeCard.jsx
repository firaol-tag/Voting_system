import { useNavigate } from "react-router-dom";

const NomineeCard = ({ nominee, vote }) => {
  const navigate = useNavigate();
  const handleVoteClick = () => {
    navigate("/vote", {
      state: { nomineeName: nominee.name },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
      <img
        src={`http://localhost:3270${nominee.photo}`}
        alt={nominee.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          {nominee.name}
        </h2>

        <p className="text-gray-500 mb-2">
          {nominee.dep}
        </p>

        <p className="text-green-600 font-semibold mb-4">
          Votes: {vote}
        </p>

        <button
          onClick={handleVoteClick}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition active:scale-95"
        >
          Vote
        </button>
      </div>
    </div>
  );
};

export default NomineeCard;
