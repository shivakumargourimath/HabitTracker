// AI Service using Groq API for personalized habit insights
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL } from '@env';

// Use environment variables for configuration
const API_URL = GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = GROQ_MODEL || 'llama-3.1-8b-instant';
const DEFAULT_API_KEY = GROQ_API_KEY; // Load from .env file

// Store API key securely
const AI_API_KEY_STORAGE = '@ai_api_key';

class AIService {
  constructor() {
    this.apiKey = DEFAULT_API_KEY; // Initialize with default key
    this.loadApiKey();
    // Request deduplication map
    this.pendingRequests = new Map();
    // In-memory cache for faster access
    this.memoryCache = new Map();
  }

  async loadApiKey() {
    try {
      const key = await AsyncStorage.getItem(AI_API_KEY_STORAGE);
      if (key) {
        this.apiKey = key;
      } else if (DEFAULT_API_KEY) {
        // Store default key if none exists
        await this.setApiKey(DEFAULT_API_KEY);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      // Fallback to default if loading fails
      if (!this.apiKey) {
        this.apiKey = DEFAULT_API_KEY;
      }
    }
  }

  async setApiKey(key) {
    try {
      await AsyncStorage.setItem(AI_API_KEY_STORAGE, key);
      this.apiKey = key;
      return { success: true };
    } catch (error) {
      console.error('Error saving API key:', error);
      return { success: false, error: error.message };
    }
  }

  async makeRequest(messages, temperature = 0.7, maxTokens = 500) {
    if (!this.apiKey) {
      await this.loadApiKey();
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }
    }

    // Create request key for deduplication
    const requestKey = JSON.stringify({ messages, temperature, maxTokens });
    
    // Check if same request is already pending
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    // Create new request promise
    const requestPromise = (async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('AI Request Error:', error);
        throw error;
      } finally {
        // Clean up pending request
        this.pendingRequests.delete(requestKey);
      }
    })();

    // Store pending request
    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  // Generate personalized motivational message
  async generateMotivationalMessage(habit, userStats) {
    const { name, streak, completionRate } = habit;
    const { totalHabits, averageStreak, consistencyScore } = userStats;

    const prompt = `You are a supportive habit coach. Generate a SHORT (1-2 sentences), personalized, encouraging message for a user working on their "${name}" habit.

Context:
- Current streak: ${streak} days
- Completion rate: ${completionRate}%
- User's consistency score: ${consistencyScore}%
- Total active habits: ${totalHabits}
- Average streak across habits: ${averageStreak} days

Be specific, warm, and motivating. Focus on their progress and next steps. Keep it under 40 words.`;

    try {
      const message = await this.makeRequest([
        {
          role: 'system',
          content: 'You are an enthusiastic and supportive habit coach who gives brief, personalized encouragement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.8, 150);

      return {
        success: true,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackMotivation(streak, completionRate),
      };
    }
  }

  // Generate actionable tips
  async generateHabitTips(habit, insights) {
    const { name, description, category } = habit;
    const { bestDay, avgCompletionTime, consistencyScore, trend } = insights;

    const prompt = `As a habit formation expert, provide 3 SHORT, actionable tips to improve consistency for the habit: "${name}".

Context:
- Description: ${description || 'Not provided'}
- Category: ${category || 'General'}
- Best day: ${bestDay}
- Average time: ${avgCompletionTime}
- Consistency: ${consistencyScore}%
- Trend: ${trend}

Provide 3 specific, practical tips. Each tip should be ONE sentence (max 15 words). Focus on timing, environment, or habit stacking.

Format as:
1. [Tip]
2. [Tip]
3. [Tip]`;

    try {
      const tips = await this.makeRequest([
        {
          role: 'system',
          content: 'You are a practical habit formation expert who gives concise, evidence-based advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.7, 200);

      return {
        success: true,
        tips: this.parseTips(tips),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackTips(habit),
      };
    }
  }

  // Generate smart reminder message
  async generateReminderMessage(habit, context) {
    const { name, streak, lastCompleted } = habit;
    const { timeOfDay, dayOfWeek, consecutiveMisses } = context;

    const prompt = `Create a SHORT, friendly reminder (1 sentence, max 25 words) to complete the habit: "${name}".

Context:
- Current streak: ${streak} days
- Time: ${timeOfDay}
- Day: ${dayOfWeek}
- Last completed: ${lastCompleted}
- Consecutive misses: ${consecutiveMisses || 0}

Make it encouraging but urgent if needed. Use emojis sparingly.`;

    try {
      const message = await this.makeRequest([
        {
          role: 'system',
          content: 'You are a friendly reminder assistant. Keep messages brief and encouraging.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.8, 100);

      return {
        success: true,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackReminder(name, streak),
      };
    }
  }

  // Generate weekly summary with insights
  async generateWeeklySummary(weekData) {
    const { habitsCompleted, streaksGained, streaksLost, topHabit, improvementNeeded } = weekData;

    const prompt = `Create a brief, motivating weekly summary for a habit tracker user.

This week:
- Habits completed: ${habitsCompleted}
- Streaks gained: ${streaksGained}
- Streaks lost: ${streaksLost}
- Top habit: ${topHabit}
- Needs improvement: ${improvementNeeded}

Provide:
1. A 1-sentence celebration of achievements
2. A 1-sentence encouragement for improvement
3. A 1-sentence goal for next week

Keep it positive, specific, and under 60 words total.`;

    try {
      const summary = await this.makeRequest([
        {
          role: 'system',
          content: 'You are a supportive habit coach providing weekly check-ins.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.7, 250);

      return {
        success: true,
        summary: summary.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackWeeklySummary(weekData),
      };
    }
  }

  // Generate comeback message after break
  async generateComebackMessage(habit, daysSinceCompletion) {
    const { name, longestStreak, totalCompletions } = habit;

    const prompt = `A user hasn't completed their "${name}" habit in ${daysSinceCompletion} days. They previously had a ${longestStreak}-day streak and ${totalCompletions} total completions.

Write a compassionate, motivating comeback message (2 sentences, under 35 words). Acknowledge the break without judgment, remind them of past success, and encourage restart.`;

    try {
      const message = await this.makeRequest([
        {
          role: 'system',
          content: 'You are a compassionate habit coach who helps people restart after setbacks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.8, 150);

      return {
        success: true,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackComeback(name, longestStreak),
      };
    }
  }

  // Generate milestone celebration
  async generateMilestoneCelebration(milestone) {
    const { habitName, achievement, streakLength, percentile } = milestone;

    const prompt = `Celebrate this habit milestone achievement!

Habit: "${habitName}"
Achievement: ${achievement}
Streak: ${streakLength} days
Percentile: Top ${percentile}% of users

Write an enthusiastic 1-2 sentence celebration (under 30 words). Use emojis. Make it feel special!`;

    try {
      const message = await this.makeRequest([
        {
          role: 'system',
          content: 'You are an enthusiastic celebrator of habit achievements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.9, 120);

      return {
        success: true,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: `🎉 Amazing! ${streakLength}-day streak on ${habitName}! Keep going!`,
      };
    }
  }

  // Generate weekly habit analysis with AI insights
  async generateWeeklyAnalysis(weeklyHabitData) {
    const { habits, completionsByDay, overallStats } = weeklyHabitData;
    
    // Check if this is a new user with limited data
    const totalCompletions = habits.reduce((sum, h) => sum + (h.completionCount || 0), 0);
    const isNewUser = totalCompletions <= 3 && habits.length <= 2;
    
    // Analyze patterns
    const habitSummaries = habits.map(h => {
      const missedDays = h.missedDays || [];
      const completedDays = h.completedDays || [];
      return `${h.name}: completed ${completedDays.length}/7 days${missedDays.length > 0 ? `, missed on ${missedDays.join(', ')}` : ''}`;
    }).join('; ');

    let prompt;
    if (isNewUser) {
      // Special prompt for new users
      prompt = `Welcome a new user who just started their habit tracking journey!

Their habits:
${habitSummaries}

Total habits: ${habits.length}
Total completions so far: ${totalCompletions}

Provide:
1. A warm welcome and encouragement for taking the first step
2. One simple tip to build momentum early on
3. Reassurance that consistency comes with practice

Keep it warm, encouraging, and under 70 words. Focus on the excitement of starting rather than performance.`;
    } else {
      // Regular prompt for established users
      prompt = `As a habit coach, analyze this user's last 7 days of habit tracking and provide personalized, actionable feedback.

Weekly Data:
${habitSummaries}

Overall Stats:
- Total habits tracked: ${habits.length}
- Average completion rate: ${overallStats.avgCompletionRate}%
- Best day: ${overallStats.bestDay} (${overallStats.bestDayCompletions} completions)
- Worst day: ${overallStats.worstDay} (${overallStats.worstDayCompletions} completions)
- Most consistent habit: ${overallStats.mostConsistentHabit}
- Needs most improvement: ${overallStats.needsImprovement}

Provide:
1. One key observation about patterns (e.g., weekday vs weekend, specific days)
2. One specific, actionable recommendation to improve
3. One motivational insight or encouragement

Keep it conversational, specific, and under 80 words total. Focus on behavioral patterns, not just numbers.`;
    }

    try {
      const analysis = await this.makeRequest([
        {
          role: 'system',
          content: isNewUser 
            ? 'You are a warm, encouraging habit coach welcoming someone to their journey.'
            : 'You are an insightful habit coach who identifies patterns and provides actionable advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 0.7, 300);

      return {
        success: true,
        analysis: analysis.trim(),
        timestamp: new Date().toISOString(),
        stats: overallStats,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackWeeklyAnalysis(overallStats, isNewUser),
      };
    }
  }

  // Fallback messages when API is unavailable
  getFallbackMotivation(streak, completionRate) {
    if (streak >= 30) {
      return "🔥 30+ day streak! You're unstoppable! Keep this momentum going!";
    } else if (streak >= 7) {
      return "💪 One week strong! You're building an amazing habit!";
    } else if (completionRate >= 80) {
      return "⭐ Great consistency! You're on the right track!";
    } else {
      return "🌟 Every day is a new opportunity! You've got this!";
    }
  }

  getFallbackTips(habit) {
    return [
      "Set a specific time each day for this habit",
      "Link it to an existing routine (habit stacking)",
      "Start with 2 minutes if motivation is low",
    ];
  }

  getFallbackReminder(name, streak) {
    if (streak > 0) {
      return `⏰ Don't break your ${streak}-day streak on ${name}!`;
    }
    return `🎯 Time to work on ${name}! Let's build that streak!`;
  }

  getFallbackWeeklySummary(weekData) {
    return `This week you completed ${weekData.habitsCompleted} habits! ${weekData.topHabit} is going strong. Focus on ${weekData.improvementNeeded} next week. Keep building!`;
  }

  getFallbackComeback(name, longestStreak) {
    return `Welcome back! Your ${longestStreak}-day streak on ${name} shows you can do this. Let's start fresh today! 💪`;
  }

  getFallbackWeeklyAnalysis(stats, isNewUser = false) {
    let message = '';
    
    // Special message for new users
    if (isNewUser) {
      return `🌟 Welcome to your habit tracking journey! You've taken the first step, which is often the hardest. Start small, be consistent, and celebrate every completion. The key is showing up daily, even if it's just for a few minutes. You've got this! 💪`;
    }
    
    if (stats.avgCompletionRate >= 80) {
      message = `🔥 Excellent week! You maintained ${stats.avgCompletionRate}% completion. `;
    } else if (stats.avgCompletionRate >= 60) {
      message = `💪 Good progress at ${stats.avgCompletionRate}%. `;
    } else if (stats.avgCompletionRate >= 30) {
      message = `🌟 You're building momentum at ${stats.avgCompletionRate}%. `;
    } else if (stats.avgCompletionRate > 0) {
      message = `🚀 Great start! Every completion counts. `;
    } else {
      message = `🌱 New beginnings! Time to start tracking. `;
    }
    
    if (stats.worstDay && stats.worstDay !== 'N/A') {
      message += `${stats.worstDay}s seem challenging - try scheduling habits earlier in the day. `;
    }
    
    if (stats.needsImprovement && stats.needsImprovement !== 'N/A') {
      message += `Focus on "${stats.needsImprovement}" next week. `;
    }
    
    message += `Keep building those streaks! 🎯`;
    
    return message;
  }

  // Helper to parse tips from AI response
  parseTips(tipsText) {
    const lines = tipsText.split('\n').filter(line => line.trim());
    const tips = [];
    
    for (const line of lines) {
      const cleaned = line.replace(/^\d+\.\s*/, '').trim();
      if (cleaned && cleaned.length > 10) {
        tips.push(cleaned);
      }
    }
    
    return tips.slice(0, 3);
  }

  // Cache management for AI responses
  async cacheResponse(key, data, expiryHours = 24) {
    try {
      const cacheData = {
        data,
        expiry: Date.now() + (expiryHours * 60 * 60 * 1000),
      };
      await AsyncStorage.setItem(`ai_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }

  async getCachedResponse(key) {
    // Check memory cache first (faster)
    if (this.memoryCache.has(key)) {
      const { data, expiry } = this.memoryCache.get(key);
      if (Date.now() < expiry) {
        return data;
      }
      this.memoryCache.delete(key);
    }

    // Check persistent cache
    try {
      const cached = await AsyncStorage.getItem(`ai_cache_${key}`);
      if (cached) {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() < expiry) {
          // Store in memory cache for future use
          this.memoryCache.set(key, { data, expiry });
          return data;
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;

// Export individual functions for easier imports
export const {
  setApiKey,
  generateMotivationalMessage,
  generateHabitTips,
  generateReminderMessage,
  generateWeeklySummary,
  generateComebackMessage,
  generateMilestoneCelebration,
  generateWeeklyAnalysis,
} = {
  setApiKey: (key) => aiService.setApiKey(key),
  generateMotivationalMessage: (habit, userStats) => aiService.generateMotivationalMessage(habit, userStats),
  generateHabitTips: (habit, insights) => aiService.generateHabitTips(habit, insights),
  generateReminderMessage: (habit, context) => aiService.generateReminderMessage(habit, context),
  generateWeeklySummary: (weekData) => aiService.generateWeeklySummary(weekData),
  generateComebackMessage: (habit, days) => aiService.generateComebackMessage(habit, days),
  generateMilestoneCelebration: (milestone) => aiService.generateMilestoneCelebration(milestone),
  generateWeeklyAnalysis: (weeklyData) => aiService.generateWeeklyAnalysis(weeklyData),
};
