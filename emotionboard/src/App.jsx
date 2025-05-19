import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Stats from './components/Stats';
import { Typewriter } from 'react-simple-typewriter';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { analyzeMood } from './services/moodAnalysis';

function App() {
  const [entry, setEntry] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [theme, setTheme] = useState('pastel');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('calm', calmMode);
    const audio = new Audio('/sounds/rain.mp3');
    audio.loop = true;
    calmMode ? audio.play() : audio.pause();
    return () => audio.pause();
  }, [calmMode]);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('pastel', theme === 'pastel');
  }, [theme]);

  const saveEntry = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    const { mood } = await analyzeMood(entry);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(today, JSON.stringify({ entry, mood }));
    setEntry('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setLoading(false);
  };

  const downloadPDF = () => {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(today);
    if (!data) return alert("No journal entry found for today.");

    const { entry, mood } = JSON.parse(data);
    const element = document.createElement('div');
    element.innerHTML = `
      <h2>EmotionBoard Journal</h2>
      <p><strong>Date:</strong> ${today}</p>
      <p><strong>Mood:</strong> ${mood}</p>
      <p><strong>Entry:</strong><br/>${entry}</p>
    `;

    html2pdf().from(element).set({ filename: `journal-${today}.pdf` }).save();
  };

  const downloadMarkdown = () => {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(today);
    if (!data) return alert("No journal entry found for today.");
    const { entry, mood } = JSON.parse(data);

    const mdContent = `# EmotionBoard Journal Entry\n\n**Date:** ${today}\n**Mood:** ${mood}\n\n## Entry\n${entry}`;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${today}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 transition-colors duration-500"
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-200 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Typewriter
          words={['EmotionBoard Journal', 'Your Inner Voice, Visualized.', 'Track. Reflect. Grow.']}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={2000}
        />
      </motion.h1>

      <motion.div
        className="max-w-xl mx-auto backdrop-blur-sm bg-white/30 p-6 rounded-xl shadow-xl border border-purple-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setCalmMode(!calmMode)}
            className="px-4 py-2 rounded-lg bg-teal-200 text-black hover:bg-teal-300 shadow"
          >
            {calmMode ? '🌙 Calm Mode ON' : '☀️ Calm Mode OFF'}
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'pastel' : 'dark')}
            className="px-4 py-2 rounded-lg bg-sky-200 text-black hover:bg-sky-300 shadow"
          >
            {theme === 'dark' ? '🌸 Pastel Theme' : '🌑 Dark Theme'}
          </button>
        </div>

        <textarea
          className="w-full h-40 p-5 rounded-lg bg-pink-100 text-black border border-purple-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-inner resize-none"
          placeholder="Write about your day..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <button
          onClick={saveEntry}
          className="mt-5 bg-gradient-to-r from-pink-200 to-purple-200 text-black hover:from-pink-300 hover:to-purple-300 px-6 py-3 rounded-lg font-medium shadow transition-all duration-300 w-full"
        >
          💾 {loading ? 'Saving...' : 'Save Entry'}
        </button>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={downloadPDF}
            className="bg-yellow-200 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-medium shadow w-full"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={downloadMarkdown}
            className="bg-lime-200 hover:bg-lime-300 text-black px-4 py-2 rounded-lg font-medium shadow w-full"
          >
            📝 Export as Markdown
          </button>
        </div>
      </motion.div>

      <Calendar />
      <Stats />

      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-6 right-6 bg-green-200 text-black px-5 py-3 rounded-lg shadow border border-green-400 flex items-center"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            ✅ Entry saved!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
