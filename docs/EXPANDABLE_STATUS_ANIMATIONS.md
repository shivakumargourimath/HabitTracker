# Expandable Status Section - Animation Documentation

## Overview
The Home-Modern.js screen now includes a beautifully animated expandable status section that displays detailed habit statistics with smooth transitions and professional effects.

---

## 🎬 Animation Features

### 1. **Chevron Rotation Animation**
- **Duration**: 300ms
- **Behavior**: Rotates from 0° to 180° when expanding/collapsing
- **Effect**: The chevron icon smoothly rotates to indicate the expanded state
- **Implementation**: Uses `Animated.timing` with `useNativeDriver: true` for optimal performance

```javascript
const chevronRotation = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});
```

### 2. **Content Height Animation**
- **Duration**: 300ms
- **Behavior**: Expands from 0 to 300 pixels height
- **Effect**: Smooth sliding effect when revealing/hiding the stats grid
- **Implementation**: Uses `maxHeight` with interpolation for smooth expansion

```javascript
const contentHeight = heightAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 300],
});
```

### 3. **Fade In/Out Animation**
- **Duration**: 250ms
- **Behavior**: Fades content in and out during expand/collapse
- **Effect**: Smooth opacity transition for professional look
- **Implementation**: Simple opacity animation with native driver

### 4. **Staggered Stat Card Animations** ⭐
- **Stagger Delay**: 60ms between each card
- **Duration**: 300ms per card
- **Cards**: 4 cards (Completed, Pending, Avg Streak, Best Streak)
- **Effect**: Cards appear one after another with a cascading effect
- **Animations**: 
  - Opacity: 0 → 1
  - TranslateY: 20px → 0px (slides up while fading in)

```javascript
Animated.stagger(60, [
  Animated.timing(statCard1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(statCard2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(statCard3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(statCard4Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
]).start();
```

---

## 📊 Statistics Displayed

The expandable section shows four key metrics in gradient cards:

1. **Completed** 
   - Icon: ✓ (checkbox-multiple-marked)
   - Color: Primary gradient (#667eea → #764ba2)
   - Shows: Number of habits completed today

2. **Pending**
   - Icon: 🕐 (clock-outline)
   - Color: Pink gradient (#f093fb → #f5576c)
   - Shows: Number of habits yet to complete

3. **Avg Streak**
   - Icon: 🔥 (fire)
   - Color: Blue gradient (#4facfe → #00f2fe)
   - Shows: Average streak across all habits

4. **Best Streak**
   - Icon: 🏆 (trophy)
   - Color: Green gradient (#43e97b → #38f9d7)
   - Shows: Longest current streak among all habits

---

## 🎯 User Interaction Flow

1. **Initial State**: Status button shown with summary (e.g., "3 of 5 completed")
2. **User Taps**: Toggle button triggers all animations in parallel
3. **Expanding**:
   - Chevron rotates 180°
   - Content area expands to 300px height
   - Content fades in
   - Stat cards appear in staggered sequence (cascade effect)
4. **Collapsing**:
   - All animations reverse smoothly
   - Stat card values reset to 0 instantly (ready for next expansion)

---

## 🔧 Technical Implementation

### Animation Values Used:
- `rotateAnim`: Controls chevron rotation
- `heightAnim`: Controls content height expansion
- `opacityAnim`: Controls fade in/out of entire section
- `statCard1Anim` - `statCard4Anim`: Individual card animations

### Performance Optimizations:
- ✅ Uses `useNativeDriver: true` wherever possible (transform, opacity)
- ✅ Uses `useNativeDriver: false` only for layout properties (height)
- ✅ Parallel animations run simultaneously for smooth experience
- ✅ Stagger animations create visual hierarchy without performance cost

### Animation Timing:
- **Total expand duration**: ~660ms (300ms base + 4 cards × 60ms stagger + 300ms animation)
- **Total collapse duration**: 300ms (instant reset for cards)

---

## 🎨 Visual Design

- **Button**: White gradient with subtle shadow
- **Icon**: Chart box with primary color
- **Cards**: Semi-transparent gradients with custom colors per metric
- **Layout**: 2×2 grid for balanced appearance
- **Spacing**: Consistent padding and margins using design system
- **CTA Button**: "View Detailed Stats" with arrow for navigation

---

## 🚀 Usage

The animations are automatic - users simply tap the "Habit Status" button to expand/collapse. No additional configuration needed.

### To customize animation timing:
```javascript
// In toggleStatusSection function
Animated.timing(rotateAnim, {
  toValue,
  duration: 300, // Change this value (milliseconds)
  useNativeDriver: true,
})
```

### To customize stagger delay:
```javascript
Animated.stagger(60, [ // Change 60 to adjust delay between cards
  // animations...
])
```

---

## 📱 Compatibility

- ✅ iOS
- ✅ Android  
- ✅ Expo Go
- ✅ Production builds

All animations use the React Native Animated API with native driver support for 60fps performance.

---

## 🎉 Result

A polished, professional expandable section that enhances the user experience with:
- Smooth, buttery animations
- Clear visual feedback
- Engaging cascading effects
- No performance impact
- Native feel on both platforms
