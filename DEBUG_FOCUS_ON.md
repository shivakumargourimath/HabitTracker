# 🐛 DEBUG: "Focus On" Not Updating

## What to Check

When you complete a habit, watch the console for these specific logs:

### Expected Log Sequence:

```javascript
// 1. Habit completion
🔥 Streak Update: { habitName: "Morning Exercise", ... }

// 2. Home screen recalculates
🔄 Home Screen - Recalculating weeklyData...

// 3. Weekly analyzer processes habits
📊 Weekly Analyzer - Input habits: 3

// 4. NEW: Shows ALL habits sorted by completion rate
🔍 Sorted habits by consistency: ["Drink Water: 100%", "Morning Exercise: 86%", "Read: 43%"]

// 5. NEW: Shows which habit needs improvement
✅ Most consistent: Drink Water
⚠️  Needs improvement: Read for 30 minutes

// 6. Weekly analysis complete
📊 Weekly Analysis Complete: { ... }

// 7. Home screen logs the data
✅ Home Screen - WeeklyData: {
  avgCompletionRate: 81,
  needsImprovement: "Read for 30 minutes"  // ← Should match step 5
}

// 8. NEW: UI displays the value
🎯 UI displaying Focus On: Read for 30 minutes
```

## 🧪 Test Now

### Step 1: Complete a Habit
1. Open console (press `j`)
2. Complete ANY habit
3. Look for the sequence above

### Step 2: Check These Specific Logs

**Question 1:** After completing a habit, do you see "🔍 Sorted habits by consistency"?
- [ ] YES - Continue to Question 2
- [ ] NO - The weekly analyzer isn't running

**Question 2:** Does "⚠️ Needs improvement" show the CORRECT habit name?
- [ ] YES - Continue to Question 3
- [ ] NO - The sorting/calculation is wrong

**Question 3:** Does "✅ Home Screen - WeeklyData" show the CORRECT needsImprovement?
- [ ] YES - Continue to Question 4
- [ ] NO - useMemo isn't returning the right value

**Question 4:** Does "🎯 UI displaying Focus On" show the CORRECT habit name?
- [ ] YES - Then it IS updating! (Just slowly via AI)
- [ ] NO - The UI isn't reading the right prop

## 🎯 Understanding "Focus On"

### How It's Calculated:

1. **Analyze each habit** over last 7 days
2. **Calculate completion rate** for each (0-100%)
3. **Sort by completion rate** (highest to lowest)
4. **Pick the LAST one** (lowest completion rate)

### Example:

If you have these habits:
```
Drink Water: 7/7 days = 100%
Morning Exercise: 6/7 days = 86%
Read for 30 minutes: 3/7 days = 43%
```

**Focus On will show:** "Read for 30 minutes" (lowest at 43%)

### When It Updates:

**Scenario 1: You complete the "Focus On" habit**
```
Before:
- Drink Water: 100%
- Morning Exercise: 86%
- Read: 43% ← Current "Focus On"

You complete "Read for 30 minutes"

After:
- Drink Water: 100%
- Read: 57% (improved from 43%)
- Morning Exercise: 86%

Focus On changes to: "Morning Exercise" (new worst at 86%)
```

**Scenario 2: You complete a different habit**
```
Before:
- Drink Water: 100%
- Morning Exercise: 86%
- Read: 43% ← Current "Focus On"

You complete "Morning Exercise"

After:
- Drink Water: 100%
- Morning Exercise: 100% (improved from 86%)
- Read: 43%

Focus On STAYS: "Read for 30 minutes" (still the worst)
```

## 🔍 Debugging Steps

### If "Focus On" seems stuck:

1. **Check completion rates** in console:
   ```
   🔍 Sorted habits by consistency: [PASTE HERE]
   ```

2. **Verify which habit should be shown**:
   - It should be the LAST habit in the sorted list
   - The one with LOWEST completion rate

3. **Complete the "Focus On" habit**:
   - This should definitely make it change
   - Watch console for new sorting

4. **Check if percentages are updating**:
   - Look at "🔍 Sorted habits" before and after
   - Percentages should change when you complete habits

## 📝 What to Report

If "Focus On" is still not updating correctly, copy-paste these console sections:

### Before Completing Habit:
```
✅ Home Screen - WeeklyData: {
  needsImprovement: [PASTE VALUE HERE]
}

🔍 Sorted habits by consistency: [PASTE ARRAY HERE]

⚠️ Needs improvement: [PASTE VALUE HERE]

🎯 UI displaying Focus On: [PASTE VALUE HERE]
```

### After Completing Habit:
```
🔥 Streak Update: { habitName: [WHICH HABIT?] }

🔍 Sorted habits by consistency: [PASTE ARRAY HERE]

⚠️ Needs improvement: [PASTE VALUE HERE]

✅ Home Screen - WeeklyData: {
  needsImprovement: [PASTE VALUE HERE]
}

🎯 UI displaying Focus On: [PASTE VALUE HERE]
```

### Also Tell Me:
- Which habit did you complete?
- What was "Focus On" showing before?
- What completion rates were shown in console?
- Did "Focus On" change or stay the same?

## 💡 Expected Behavior

**"Focus On" will ONLY change if:**
1. You complete the habit that's currently shown in "Focus On", OR
2. You complete another habit SO MUCH that it becomes worse than the current "Focus On"

**"Focus On" will NOT change if:**
- You complete a habit that's already better than the "Focus On" habit
- The "Focus On" habit is still the worst one

This is CORRECT behavior - it's showing you which habit needs the most attention!

---

**Test it now and paste the console logs!** 🎯
