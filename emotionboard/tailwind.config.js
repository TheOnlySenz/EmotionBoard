export default {
    darkMode: 'class',  // ⬅️ Add this line
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          moodHappy: '#86efac',
          moodSad: '#60a5fa',
          moodAngry: '#f87171',
          moodNeutral: '#facc15',
          pastelPink: '#ffdbda',
          pastelBlue: '#d1e5f7',
          pastelYellow: '#fff2cc',
          pastelGreen: '#d6f5d6',
          pastelPurple: '#e9dbf9',
          textPrimary: '#5c5c5c',
          textSecondary: '#8a8a8a',
        },
        boxShadow: {
          'custom': '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'custom': '16px',
        },
      },
    },
    plugins: [],
  }
  
  