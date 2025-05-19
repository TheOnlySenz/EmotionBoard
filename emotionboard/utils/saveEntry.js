import { analyzeMood } from '../services/moodAnalysis';

export const saveEntry = async (entry) => {
  if (!entry.trim()) return null;
  
  const { mood } = await analyzeMood(entry);
  const today = new Date().toISOString().split('T')[0];
  
  localStorage.setItem(today, JSON.stringify({ entry, mood }));
  
  return { mood };
};
