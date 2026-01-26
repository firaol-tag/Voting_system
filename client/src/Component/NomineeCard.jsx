import { motion } from "framer-motion";

const NomineeCard = ({ nominee, votes = 0, rank, onVote, disabled }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden transition-all"
    >
      <img
        src={`http://192.168.101.181:3270${nominee.photo}`}
        alt={nominee.name}
        className="w-full h-56 object-contain"
      />

      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-white">{nominee.name}</h2>
        {/* <p className="text-sm text-gray-300">{nominee.dep}</p> */}

        <div className="mt-3 text-yellow-400 font-bold text-lg">
          {votes} Votes
        </div>

        <button
          onClick={onVote}
          disabled={disabled}
          className={`mt-4 w-full py-2 rounded-xl font-bold transition ${
            disabled
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90"
          }`}
        >
          Vote Now
        </button>
      </div>
    </motion.div>
  );
};

export default NomineeCard;
