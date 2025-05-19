import { useState, useEffect } from 'react';
import Modal from './Modal';

const moodColors = {
  happy: 'bg-moodHappy',
  sad: 'bg-moodSad',
  angry: 'bg-moodAngry',
  neutral: 'bg-moodNeutral',
  unknown: 'bg-zinc-800',
};

const generateDays = (daysInMonth = 30) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i).toISOString().split('T')[0];
    const stored = localStorage.getItem(date);
    const data = stored ? JSON.parse(stored) : null;
    days.push({ date, mood: data?.mood || 'unknown', entry: data?.entry || '' });
  }
  return days;
};

export default function Calendar() {
  const [days, setDays] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setDays(generateDays(30));
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-12 mb-4">Mood Calendar</h2>
      <div className="grid grid-cols-7 gap-2 max-w-3xl mx-auto">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`rounded-lg h-20 flex items-center justify-center text-sm font-medium cursor-pointer transition duration-200 hover:scale-105 ${moodColors[day.mood]}`}
            onClick={() => setSelected(day)}
          >
            {new Date(day.date).getDate()}
          </div>
        ))}
      </div>

      <Modal
        show={!!selected}
        onClose={() => setSelected(null)}
        entry={selected?.entry}
        mood={selected?.mood}
        date={selected?.date}
      />
    </>
  );
}
