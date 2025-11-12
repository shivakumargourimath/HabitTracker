// Utility functions to analyze weekly habit completion data

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Analyzes the last 7 days of habit data and returns structured insights
 * @param {Array} habits - Array of habit objects with completion history
 * @returns {Object} - Structured weekly analysis data
 */
export const analyzeWeeklyHabits = (habits) => {
  if (!habits || habits.length === 0) {
    return {
      habits: [],
      completionsByDay: {},
      overallStats: {
        avgCompletionRate: 0,
        bestDay: 'N/A',
        bestDayCompletions: 0,
        worstDay: 'N/A',
        worstDayCompletions: 0,
        mostConsistentHabit: 'N/A',
        needsImprovement: 'N/A',
      },
      weekId: getWeekId(),
    };
  }

  // Get last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      date: date,
      dateString: date.toISOString().split('T')[0],
      dayName: DAYS_OF_WEEK[date.getDay()],
    };
  }).reverse();

  // Analyze each habit over the last 7 days
  const analyzedHabits = habits.map(habit => {
    const completedDays = [];
    const missedDays = [];
    let completionCount = 0;

    last7Days.forEach(day => {
      // Check if habit was completed on this day
      const wasCompleted = checkHabitCompletedOnDate(habit, day.dateString);
      
      if (wasCompleted) {
        completionCount++;
        completedDays.push(day.dayName);
      } else {
        missedDays.push(day.dayName);
      }
    });

    const completionRate = Math.round((completionCount / 7) * 100);

    return {
      id: habit.id,
      name: habit.name,
      completionRate,
      completedDays,
      missedDays,
      completionCount,
    };
  });

  // Calculate completions by day of week
  const completionsByDay = {};
  last7Days.forEach(day => {
    let dayCompletions = 0;
    habits.forEach(habit => {
      if (checkHabitCompletedOnDate(habit, day.dateString)) {
        dayCompletions++;
      }
    });
    completionsByDay[day.dayName] = (completionsByDay[day.dayName] || 0) + dayCompletions;
  });

  // Find best and worst days
  const dayCompletionArray = Object.entries(completionsByDay).map(([day, count]) => ({
    day,
    count,
  }));
  
  dayCompletionArray.sort((a, b) => b.count - a.count);
  
  const bestDay = dayCompletionArray[0]?.day || 'N/A';
  const bestDayCompletions = dayCompletionArray[0]?.count || 0;
  const worstDay = dayCompletionArray[dayCompletionArray.length - 1]?.day || 'N/A';
  const worstDayCompletions = dayCompletionArray[dayCompletionArray.length - 1]?.count || 0;

  // Find most consistent and least consistent habits
  const sortedByConsistency = [...analyzedHabits].sort(
    (a, b) => b.completionRate - a.completionRate
  );
  
  const mostConsistentHabit = sortedByConsistency[0]?.name || 'N/A';
  const needsImprovement = sortedByConsistency[sortedByConsistency.length - 1]?.name || 'N/A';

  // Calculate average completion rate
  const totalCompletionRate = analyzedHabits.reduce(
    (sum, habit) => sum + habit.completionRate,
    0
  );
  const avgCompletionRate = habits.length > 0
    ? Math.round(totalCompletionRate / habits.length)
    : 0;

  return {
    habits: analyzedHabits,
    completionsByDay,
    overallStats: {
      avgCompletionRate,
      bestDay,
      bestDayCompletions,
      worstDay,
      worstDayCompletions,
      mostConsistentHabit,
      needsImprovement,
      totalHabits: habits.length,
      weekStartDate: last7Days[0].dateString,
      weekEndDate: last7Days[last7Days.length - 1].dateString,
    },
    weekId: getWeekId(),
  };
};

/**
 * Check if a habit was completed on a specific date
 * @param {Object} habit - Habit object
 * @param {String} dateString - Date in YYYY-MM-DD format
 * @returns {Boolean}
 */
const checkHabitCompletedOnDate = (habit, dateString) => {
  // Use completionHistory (the actual field name in HabitContext)
  const completionHistory = habit.completionHistory || habit.completionDates || [];
  
  if (!Array.isArray(completionHistory) || completionHistory.length === 0) {
    // If no completion history array, check if it's today and completedToday is true
    const today = new Date().toISOString().split('T')[0];
    if (dateString === today && habit.completedToday) {
      return true;
    }
    return false;
  }

  // Check if the date exists in completionHistory array
  return completionHistory.some(completionDate => {
    // Handle both ISO string dates and YYYY-MM-DD format
    const completionDateString = typeof completionDate === 'string' && completionDate.length === 10
      ? completionDate
      : new Date(completionDate).toISOString().split('T')[0];
    return completionDateString === dateString;
  });
};

/**
 * Get a unique identifier for the current week
 * @returns {String} - Week identifier (e.g., "2025-W02")
 */
const getWeekId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};

/**
 * Format the weekly period for display
 * @param {Object} weekData - Weekly analysis data
 * @returns {String} - Formatted date range
 */
export const formatWeeklyPeriod = (weekData) => {
  if (!weekData.overallStats.weekStartDate || !weekData.overallStats.weekEndDate) {
    return 'Last 7 Days';
  }

  const startDate = new Date(weekData.overallStats.weekStartDate);
  const endDate = new Date(weekData.overallStats.weekEndDate);

  const options = { month: 'short', day: 'numeric' };
  const startFormatted = startDate.toLocaleDateString('en-US', options);
  const endFormatted = endDate.toLocaleDateString('en-US', options);

  return `${startFormatted} - ${endFormatted}`;
};
