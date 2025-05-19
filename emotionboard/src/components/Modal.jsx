import { motion } from 'framer-motion';

export default function Modal({ show, onClose, entry, mood, date }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="card text-white p-8 w-full max-w-md shadow-2xl relative"
      >
        <motion.button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors duration-300"
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
        <motion.h2 
          className="text-2xl font-semibold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Mood on {date}
        </motion.h2>
        <motion.p 
          className="text-sm mb-3 text-indigo-300 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="mr-2">🌟</span> Mood: <span className="capitalize ml-1 font-medium">{mood}</span>
        </motion.p>
        <motion.div 
          className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 text-zinc-100"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {entry}
        </motion.div>
      </motion.div>
    </div>
  );
}
