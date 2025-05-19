import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const moodColorHex = {
  happy: '#86efac',
  sad: '#60a5fa',
  angry: '#f87171',
  neutral: '#facc15',
  unknown: '#71717a',
};

export default function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(i);
      const iso = date.toISOString().split('T')[0];
      const stored = localStorage.getItem(iso);
      const parsed = stored ? JSON.parse(stored) : { mood: 'unknown' };
      days.push({ date: iso, ...parsed });
    }
    setData(days);
  }, []);

  const moodCounts = data.reduce((acc, day) => {
    acc[day.mood] = (acc[day.mood] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: data.map((d) => new Date(d.date).getDate()),
    datasets: [
      {
        label: 'Mood Trend',
        data: data.map((d) =>
          d.mood === 'happy' ? 3 :
          d.mood === 'neutral' ? 2 :
          d.mood === 'sad' ? 1 :
          d.mood === 'angry' ? 0 :
          null
        ),
        fill: false,
        backgroundColor: '#4f46e5',
        borderColor: '#818cf8',
        tension: 0.3,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Mood Distribution',
        data: Object.values(moodCounts),
        backgroundColor: Object.keys(moodCounts).map((mood) => moodColorHex[mood]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div 
      className="mt-20 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        📊 Mood Analytics
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="card p-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold mb-3 text-indigo-300">Mood Distribution</h3>
          <Pie data={pieData} options={{ plugins: { legend: { labels: { color: '#fff' } } } }} />
        </motion.div>
        <motion.div 
          className="card p-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold mb-3 text-indigo-300">Mood Trend</h3>
          <Line 
            data={lineData} 
            options={{ 
              scales: { 
                y: { grid: { color: '#333' }, ticks: { color: '#fff' } },
                x: { grid: { color: '#333' }, ticks: { color: '#fff' } }
              },
              plugins: { legend: { labels: { color: '#fff' } } }
            }} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
