import axios from 'axios';

// Mock mood analysis for fallback or testing
export const mockMoodAnalysis = (text) => {
  if (text.includes('happy')) return { mood: 'happy' };
  if (text.includes('sad')) return { mood: 'sad' };
  if (text.includes('angry')) return { mood: 'angry' };
  return { mood: 'neutral' };
};

// OpenRouter AI mood analysis
export const analyzeMoodOpenRouter = async (text) => {
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that classifies user mood from journal entries. Only return one word: happy, sad, angry, or neutral.'
          },
          {
            role: 'user',
            content: `Classify the mood of this journal entry: "${text}"`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const mood = res.data.choices[0].message.content.toLowerCase().trim();
    return { mood };
  } catch (error) {
    console.error('Error analyzing mood with OpenRouter:', error);
    // Fallback to mock analysis if API fails
    return mockMoodAnalysis(text);
  }
};

// Main mood analysis function that will try OpenRouter first, then fall back to mock
export const analyzeMood = async (text) => {
  try {
    // Check if API key is available
    if (import.meta.env.VITE_OPENROUTER_API_KEY) {
      return await analyzeMoodOpenRouter(text);
    } else {
      console.log('No OpenRouter API key found, using mock analysis');
      return mockMoodAnalysis(text);
    }
  } catch (error) {
    console.error('Error in mood analysis:', error);
    return mockMoodAnalysis(text);
  }
};