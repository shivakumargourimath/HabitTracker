// Motivational Quotes for Habit Tracking

export const MOTIVATIONAL_QUOTES = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown"
  },
  {
    text: "One day or day one. You decide.",
    author: "Unknown"
  },
  {
    text: "Progress, not perfection.",
    author: "Unknown"
  },
  {
    text: "Every accomplishment starts with the decision to try.",
    author: "Unknown"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "Consistency is the key to achieving and maintaining momentum.",
    author: "Unknown"
  },
  {
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb"
  },
  {
    text: "Your only limit is you.",
    author: "Unknown"
  },
  {
    text: "Dream it. Believe it. Build it.",
    author: "Unknown"
  }
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};

export const getQuoteOfTheDay = () => {
  // Get consistent quote for each day
  const today = new Date().toISOString().split('T')[0];
  const daysSinceEpoch = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
};
