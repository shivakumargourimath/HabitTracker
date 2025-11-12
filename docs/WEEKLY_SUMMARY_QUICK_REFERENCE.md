# AI Weekly Summary - Quick Reference

## 🎯 Feature Location
**Home Screen** - Appears between the Daily Quote Card and Today's Progress Card

## 📊 What It Shows

### Card Header
```
🎨 AI Weekly Insight
   Last 7 Days Analysis
```

### Main Analysis Section
A personalized message like:
```
💬 "You miss workouts mostly on weekends. 
   Try morning workouts instead of evening. 
   Your consistency is building strong routines!"
```

### Quick Stats Bar
Three key metrics displayed side-by-side:
- **Avg. Rate**: Overall completion percentage (e.g., 75%)
- **Best Day**: Your most productive day (e.g., Monday)
- **Focus On**: Habit needing attention (e.g., "Morning Exercise")

### Refresh Button
"🔄 Refresh Insight" - Regenerates AI analysis

## 🎨 Visual Design

### Colors
- Gradient: Purple to Pink (`#667eea` → `#764ba2`)
- Text: White with varying opacity
- Stats Icons: Green, Blue, Pink accents

### Layout
```
┌─────────────────────────────────────────┐
│ 🎨 AI Weekly Insight      [wifi icon]  │
│    Last 7 Days Analysis                 │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💬 AI analysis message here...      │ │
│ │    Personalized feedback based on   │ │
│ │    your weekly completion patterns  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────┬─────────┬─────────┬─────────┐  │
│ │📊   │ Avg.Rate│ BestDay │ FocusOn │  │
│ │     │   75%   │  Mon    │ Exercise│  │
│ └─────┴─────────┴─────────┴─────────┘  │
│                                         │
│         [ 🔄 Refresh Insight ]          │
└─────────────────────────────────────────┘
```

## 🔄 States

### 1. Loading State
```
┌─────────────────────────────────────────┐
│  [spinner] AI is analyzing your week... │
└─────────────────────────────────────────┘
```

### 2. Normal State (Online)
Shows full card with AI analysis and stats

### 3. Offline/Cached State
Same as normal but with WiFi-off indicator badge

### 4. Hidden State
Card doesn't appear if:
- No habits exist
- Less than 1 habit tracked

## 💡 Example Insights

### Pattern: Weekend Dropoff
> "Your weekday completion is strong at 85%, but weekends drop to 30%. Try scheduling habits before 10 AM on Saturday and Sunday. Small steps on weekends maintain momentum! 🎯"

### Pattern: Specific Day Issue
> "Mondays show only 20% completion while other days average 80%. Sunday planning could help - set reminders and prep your Monday habits the night before. 💪"

### Pattern: High Consistency
> "Amazing 90% completion rate! You're most consistent with 'Reading' - try applying those same triggers to other habits. Keep this incredible momentum! 🔥"

### Pattern: Need Improvement
> "You completed 'Meditation' only once this week. Start with just 2 minutes right after waking up. Link it to your coffee routine. Small wins build confidence! 🌟"

## 🛠 How to Use

### For Users:
1. Open the app home screen
2. Scroll down past the daily quote
3. View your AI weekly insight
4. Read the personalized feedback
5. Check which day is your best/worst
6. See which habit needs focus
7. Tap "Refresh Insight" for updated analysis

### For Developers:
The component automatically:
- Analyzes last 7 days on every habit change
- Caches AI responses for 24 hours
- Falls back to rule-based insights offline
- Animates smoothly on mount
- Handles loading and error states

## 📝 Data Source

### Input Required:
- Array of habits with:
  - `name`: Habit name
  - `completionDates`: Array of completion timestamps
  - OR `completedToday`: Boolean for today

### Output Generated:
- Weekly completion stats
- Best/worst day analysis
- Most/least consistent habits
- Personalized AI feedback

## 🎓 Tips for Best Results

1. **Track Multiple Habits**: The AI can identify better patterns with 3+ habits
2. **Consistent Tracking**: At least a week of data produces meaningful insights
3. **Act on Advice**: The recommendations are specific - try implementing them!
4. **Check Weekly**: Insights update when you refresh or after 24 hours
5. **Compare Progress**: Notice how insights change as you improve

## 🔧 Troubleshooting

### Card Not Showing?
- Check if you have any habits created
- Ensure you're on the Home screen
- Scroll down past the quote card

### Shows "AI is analyzing..."?
- Wait a few seconds for API response
- Check internet connection
- If >10 seconds, may fall back to offline mode

### Shows WiFi-Off Icon?
- Using cached or offline insights
- Still provides valuable feedback
- Tap refresh when online for fresh AI analysis

## 📚 Related Features

- **AI Motivation Card**: Daily personalized encouragement
- **AI Tips Card**: Specific habit improvement suggestions
- **Habit Insights Screen**: Detailed analytics per habit
- **Heat Map**: Visual weekly completion patterns

---

*The AI Weekly Summary helps you understand your patterns and gives you actionable advice to build better habits. Check it weekly to track your improvement!*
