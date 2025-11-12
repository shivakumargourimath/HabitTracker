// constants/categories.js
export const habitCategories = [
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: 'heart-pulse',
    color: '#ef4444',
    lightColor: '#fecaca',
    description: 'Physical health, exercise, and wellness habits'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'rocket-launch',
    color: '#8b5cf6',
    lightColor: '#e9d5ff',
    description: 'Work, learning, and personal development'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: 'meditation',
    color: '#06b6d4',
    lightColor: '#a5f3fc',
    description: 'Meditation, relaxation, and mental well-being'
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'account-group',
    color: '#f59e0b',
    lightColor: '#fde68a',
    description: 'Relationships, communication, and social activities'
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: 'palette',
    color: '#ec4899',
    lightColor: '#fbcfe8',
    description: 'Art, music, writing, and creative expression'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'currency-usd',
    color: '#22c55e',
    lightColor: '#bbf7d0',
    description: 'Money management, saving, and financial goals'
  },
  {
    id: 'household',
    name: 'Household',
    icon: 'home',
    color: '#94a3b8',
    lightColor: '#e2e8f0',
    description: 'Cleaning, organizing, and home maintenance'
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: 'book-open',
    color: '#3b82f6',
    lightColor: '#bfdbfe',
    description: 'Education, reading, and skill development'
  }
];

export const habitTemplates = [
  // Health & Fitness Templates
  {
    category: 'health',
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    suggestedTimes: ['08:00', '12:00', '16:00', '20:00'],
    frequency: 'daily',
    tags: ['hydration', 'health']
  },
  {
    category: 'health',
    name: 'Morning Exercise',
    description: '30 minutes of physical activity',
    suggestedTimes: ['07:00'],
    frequency: 'daily',
    tags: ['exercise', 'morning', 'fitness']
  },
  {
    category: 'health',
    name: 'Take Vitamins',
    description: 'Daily vitamin supplements',
    suggestedTimes: ['08:00'],
    frequency: 'daily',
    tags: ['supplements', 'health', 'morning']
  },
  
  // Productivity Templates
  {
    category: 'productivity',
    name: 'Deep Work Session',
    description: '2 hours of focused work',
    suggestedTimes: ['09:00'],
    frequency: 'daily',
    tags: ['focus', 'work', 'productivity']
  },
  {
    category: 'productivity',
    name: 'Email Processing',
    description: 'Clear and organize inbox',
    suggestedTimes: ['10:00', '15:00'],
    frequency: 'daily',
    tags: ['email', 'organization', 'communication']
  },
  {
    category: 'productivity',
    name: 'Plan Tomorrow',
    description: 'Review and plan next day tasks',
    suggestedTimes: ['21:00'],
    frequency: 'daily',
    tags: ['planning', 'evening', 'organization']
  },
  
  // Mindfulness Templates
  {
    category: 'mindfulness',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness',
    suggestedTimes: ['07:30'],
    frequency: 'daily',
    tags: ['meditation', 'morning', 'mindfulness']
  },
  {
    category: 'mindfulness',
    name: 'Gratitude Journal',
    description: 'Write 3 things you\'re grateful for',
    suggestedTimes: ['22:00'],
    frequency: 'daily',
    tags: ['gratitude', 'journaling', 'evening']
  },
  {
    category: 'mindfulness',
    name: 'Evening Reflection',
    description: 'Reflect on the day\'s experiences',
    suggestedTimes: ['21:30'],
    frequency: 'daily',
    tags: ['reflection', 'evening', 'self-awareness']
  },
  
  // Learning Templates
  {
    category: 'learning',
    name: 'Read for 30 Minutes',
    description: 'Daily reading habit',
    suggestedTimes: ['20:00'],
    frequency: 'daily',
    tags: ['reading', 'learning', 'evening']
  },
  {
    category: 'learning',
    name: 'Language Practice',
    description: 'Practice foreign language skills',
    suggestedTimes: ['19:00'],
    frequency: 'daily',
    tags: ['language', 'practice', 'skills']
  },
  {
    category: 'learning',
    name: 'Online Course',
    description: 'Complete a lesson or module',
    suggestedTimes: ['14:00'],
    frequency: 'daily',
    tags: ['course', 'education', 'skills']
  },
  
  // Creative Templates
  {
    category: 'creative',
    name: 'Creative Writing',
    description: 'Write for 20 minutes',
    suggestedTimes: ['06:30'],
    frequency: 'daily',
    tags: ['writing', 'creativity', 'morning']
  },
  {
    category: 'creative',
    name: 'Sketch Daily',
    description: 'Draw or sketch something',
    suggestedTimes: ['18:00'],
    frequency: 'daily',
    tags: ['drawing', 'art', 'creativity']
  },
  
  // Finance Templates
  {
    category: 'finance',
    name: 'Track Expenses',
    description: 'Record daily expenses',
    suggestedTimes: ['22:00'],
    frequency: 'daily',
    tags: ['money', 'tracking', 'budgeting']
  },
  {
    category: 'finance',
    name: 'Investment Check',
    description: 'Review investment portfolio',
    suggestedTimes: ['09:00'],
    frequency: 'weekly',
    tags: ['investing', 'finance', 'portfolio']
  },
  
  // Social Templates
  {
    category: 'social',
    name: 'Call Family',
    description: 'Connect with family members',
    suggestedTimes: ['19:00'],
    frequency: 'weekly',
    tags: ['family', 'communication', 'relationships']
  },
  {
    category: 'social',
    name: 'Reach Out to Friend',
    description: 'Message or call a friend',
    suggestedTimes: ['17:00'],
    frequency: 'weekly',
    tags: ['friends', 'social', 'relationships']
  }
];

export const commonTags = [
  'morning', 'evening', 'daily', 'weekly', 'health', 'fitness', 'work',
  'learning', 'creativity', 'mindfulness', 'productivity', 'social',
  'finance', 'habits', 'routine', 'goals', 'self-care', 'wellness'
];

// Helper function to get category by ID
export const getCategoryById = (categoryId) => {
  return habitCategories.find(cat => cat.id === categoryId);
};

// Helper function to get templates by category
export const getTemplatesByCategory = (categoryId) => {
  return habitTemplates.filter(template => template.category === categoryId);
};

// Helper function to get random templates
export const getRandomTemplates = (count = 3) => {
  const shuffled = [...habitTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};