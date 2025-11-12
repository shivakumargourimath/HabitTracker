# Performance Optimization - Quick Reference Guide

## 🎯 Quick Wins Applied

### 1. React Context Optimization
```javascript
// ✅ Always memoize context values
const contextValue = useMemo(() => ({
  data, 
  actions
}), [data]);

return <Context.Provider value={contextValue}>{children}</Context.Provider>;
```

### 2. Memoize Expensive Calculations
```javascript
// ✅ Use useMemo for calculations
const stats = useMemo(() => {
  return habits.reduce((acc, h) => /* calculate */, {});
}, [habits]);

// ✅ Use useCallback for functions
const handleAction = useCallback(() => {
  // action logic
}, [dependencies]);
```

### 3. AI Service Patterns
```javascript
// ✅ Request deduplication
const pendingRequests = new Map();
if (pendingRequests.has(key)) {
  return pendingRequests.get(key);
}

// ✅ Two-tier caching (memory + storage)
// Check memory first, then AsyncStorage
```

### 4. Component Optimization
```javascript
// ✅ Memoize child components
export default React.memo(MyComponent, (prev, next) => {
  return prev.id === next.id;
});

// ✅ Avoid inline objects in JSX
const style = useMemo(() => ({ flex: 1 }), []);
<View style={style} />
```

## 🚫 Common Anti-Patterns to Avoid

### Don't Create Objects in Render
```javascript
// ❌ BAD - Creates new object every render
<Component style={{ flex: 1 }} />

// ✅ GOOD - Stable reference
const style = { flex: 1 };
<Component style={style} />
```

### Don't Define Functions in Render
```javascript
// ❌ BAD
<Button onPress={() => doSomething()} />

// ✅ GOOD
const handlePress = useCallback(() => doSomething(), []);
<Button onPress={handlePress} />
```

### Don't Recalculate on Every Render
```javascript
// ❌ BAD
const total = items.reduce((sum, item) => sum + item.value, 0);

// ✅ GOOD
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.value, 0);
}, [items]);
```

## 📊 Performance Checklist

### Before Committing New Code
- [ ] Are expensive calculations memoized?
- [ ] Are callback functions wrapped in useCallback?
- [ ] Is context value stable (memoized)?
- [ ] Are useEffect dependencies minimal?
- [ ] Are there any console.log statements to remove?
- [ ] Can any components be wrapped in React.memo?
- [ ] Are list items using proper keys?
- [ ] Are images optimized?

### Before Deploying
- [ ] Remove all debug console.log statements
- [ ] Test on low-end device
- [ ] Check memory usage
- [ ] Verify smooth scrolling
- [ ] Test offline functionality
- [ ] Check app startup time
- [ ] Verify no memory leaks

## 🔧 Tools for Performance Monitoring

### React DevTools Profiler
```javascript
// Wrap sections in Profiler
import { Profiler } from 'react';

<Profiler id="HabitList" onRender={(id, phase, duration) => {
  if (duration > 50) {
    console.warn(`${id} rendered in ${duration}ms`);
  }
}}>
  <HabitList />
</Profiler>
```

### React Native Performance Monitor
```javascript
// In development, shake device and enable:
// - FPS (Frame Rate)
// - RAM (Memory Usage)
// - JS (JavaScript Thread)
```

## 📝 Code Review Guidelines

### Questions to Ask
1. Does this change introduce unnecessary re-renders?
2. Are dependencies in hooks correct and minimal?
3. Could this calculation be memoized?
4. Is there a simpler way to achieve this?
5. Does this work well with 100+ items?

### Red Flags
- ⚠️ useEffect with empty dependency array that could be optimized
- ⚠️ Array.map in JSX without proper keys
- ⚠️ Large objects in component state
- ⚠️ Synchronous heavy operations in render
- ⚠️ Multiple API calls for the same data

## 🎨 Best Practices Summary

### State Management
- Keep state as close to where it's used as possible
- Use context only for truly global state
- Memoize context values
- Split large contexts into smaller ones

### API Calls
- Deduplicate identical requests
- Implement smart caching strategy
- Handle offline scenarios gracefully
- Show loading states appropriately

### Database
- Use lazy initialization
- Batch operations when possible
- Handle errors gracefully
- Cache frequent queries

### Components
- Keep components small and focused
- Use React.memo for expensive components
- Avoid inline functions and objects
- Optimize list rendering with proper keys

## 📚 Resources

### Documentation
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [useMemo vs useCallback](https://react.dev/reference/react/useMemo)

### Our Codebase Examples
- **Good Context Usage:** `/context/HabitContext.js` (after optimization)
- **Memoization Example:** `/screens/Home-Modern.js`
- **Caching Strategy:** `/services/aiService.js`
- **Database Best Practices:** `/database/database.js`

## 🚀 Quick Commands

### Test Performance
```bash
# Clear cache and start
npm start -- --clear

# Run in production mode
npm run build
npm start -- --no-dev --minify
```

### Profile App
```bash
# Android
adb shell dumpsys gfxinfo <package-name>

# iOS (with Instruments)
# Use Xcode Instruments for detailed profiling
```

### Monitor Bundle Size
```bash
npx react-native-bundle-visualizer
```

## 💡 Remember

> "Premature optimization is the root of all evil" - Donald Knuth

- **Measure first:** Use profiler to find actual bottlenecks
- **Optimize what matters:** Focus on user-facing performance
- **Test thoroughly:** Ensure optimizations don't break functionality
- **Document changes:** Help future developers understand your decisions

---

**Last Updated:** 2025-10-14  
**Maintained By:** Development Team
