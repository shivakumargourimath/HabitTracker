// Habit Categories for better organization

export const HABIT_CATEGORIES = [
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: 'heart-pulse',
    color: '#ef4444',
    description: 'Exercise, nutrition, sleep, wellness'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'chart-line-variant',
    color: '#8b5cf6',
    description: 'Work, focus, time management'
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: 'book-open-variant',
    color: '#3b82f6',
    description: 'Reading, courses, skill development'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: 'meditation',
    color: '#10b981',
    description: 'Meditation, gratitude, reflection'
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'account-group',
    color: '#f59e0b',
    description: 'Family, friends, community'
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: 'palette',
    color: '#ec4899',
    description: 'Art, music, writing, crafts'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'currency-usd',
    color: '#22c55e',
    description: 'Saving, budgeting, investing'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: 'home-variant',
    color: '#06b6d4',
    description: 'Cleaning, organizing, maintenance'
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    icon: 'star',
    color: '#f97316',
    description: 'Self-improvement, habits, goals'
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'dots-horizontal',
    color: '#64748b',
    description: 'Miscellaneous habits'
  }
];

export const getCategoryById = (categoryId) => {
  return HABIT_CATEGORIES.find(cat => cat.id === categoryId) || HABIT_CATEGORIES[9]; // Default to 'Other'
};

export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.color;
};

export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category.icon;
};
