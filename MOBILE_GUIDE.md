# Mobile-First Development Guide

## 🎯 Mobile-First Principles Applied

This project follows mobile-first design principles throughout. Here's how:

## 📐 Responsive Breakpoints

```css
/* Mobile First - Default Styles (320px - 640px) */
.component { /* base mobile styles */ }

/* Tablet (640px+) */
@media (min-width: 640px) {
  .component { /* tablet enhancements */ }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component { /* desktop enhancements */ }
}
```

### Tailwind Usage
```tsx
// Mobile first, then enhance
<div className="text-sm sm:text-base lg:text-lg">
  {/* 14px on mobile, 16px on tablet, 18px on desktop */}
</div>

<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

## 👆 Touch Target Guidelines

### Minimum Sizes
- **iOS HIG**: 44×44px minimum
- **Material Design**: 48×48px minimum
- **This Project**: 44×44px with 8px spacing

### Examples
```tsx
// ✅ Good - Touch-friendly button
<button className="min-w-[44px] min-h-[44px] p-3">
  <Icon className="w-5 h-5" />
</button>

// ❌ Bad - Too small
<button className="p-1">
  <Icon className="w-3 h-3" />
</button>

// ✅ Good - Adequate spacing
<div className="flex gap-3">
  <Button />
  <Button />
</div>
```

## 🎨 Mobile UI Patterns

### 1. Bottom Navigation
**Why**: Easier thumb reach on large phones

```tsx
// src/components/mobile/BottomNav.tsx
<nav className="fixed bottom-0 left-0 right-0 pb-safe-bottom">
  {/* Navigation items */}
</nav>
```

**Key Points:**
- Fixed at bottom for thumb zone access
- Uses `pb-safe-bottom` for notched devices
- Active state with clear visual feedback
- Haptic feedback on tap

### 2. Floating Action Button (FAB)
**Why**: Primary action always accessible

```tsx
// src/components/mobile/FAB.tsx
<button className="fixed right-4 bottom-20 w-14 h-14">
  <Plus />
</button>
```

**Key Points:**
- Positioned above bottom nav
- Large tap target (56×56px)
- Can expand to show multiple actions
- Z-index ensures visibility

### 3. Bottom Sheets
**Why**: More natural on mobile than center modals

```tsx
// Usage
const sheet = useBottomSheet();

<BottomSheet
  isOpen={sheet.isOpen}
  onClose={sheet.close}
  title="Add Bookmark"
>
  {/* Sheet content */}
</BottomSheet>
```

**Features:**
- Slides up from bottom
- Draggable handle to dismiss
- Blocks body scroll when open
- Swipe down to close gesture

### 4. Pull to Refresh
**Why**: Native mobile interaction pattern

```tsx
<PullToRefresh onRefresh={async () => {
  await fetchNewData();
}}>
  {/* Content */}
</PullToRefresh>
```

**Behavior:**
- Pull down from top to trigger
- Visual feedback with spinner
- Haptic feedback on trigger
- Async operation support

### 5. Swipe Gestures
**Why**: Quick actions without menus

```tsx
<SwipeableCard
  onSwipeRight={() => favorite()}
  onSwipeLeft={() => archive()}
  rightAction={{
    icon: <Star />,
    label: 'Favorite',
    color: 'bg-yellow-500'
  }}
  leftAction={{
    icon: <Archive />,
    label: 'Archive',
    color: 'bg-blue-500'
  }}
>
  {/* Card content */}
</SwipeableCard>
```

## 📱 Mobile-Specific Features

### Haptic Feedback
```tsx
import { hapticFeedback } from '@/lib/haptics';

// Light tap
hapticFeedback.light(); // On button tap

// Success
hapticFeedback.success(); // On bookmark added

// Error
hapticFeedback.error(); // On failed operation
```

### Long Press Detection
```tsx
import { useLongPress } from '@/hooks/useLongPress';

const handlers = useLongPress({
  onLongPress: () => enterSelectionMode(),
  onPress: () => openBookmark(),
  delay: 500 // ms
});

<div {...handlers}>
  {/* Content */}
</div>
```

### Safe Area Support
```tsx
// For notched devices (iPhone X+)
<div className="pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right">
  {/* Content respects notch */}
</div>
```

## 🎭 Mobile Forms Best Practices

### Input Types
```tsx
// ✅ Use specific input types
<input type="url" /> {/* Shows URL keyboard */}
<input type="email" /> {/* Shows @ key */}
<input type="tel" /> {/* Shows number pad */}
<input type="search" /> {/* Shows search button */}

// ✅ Prevent zoom on focus (16px minimum)
<input className="text-base" /> {/* 16px base size */}
```

### Form Layout
```tsx
<form className="space-y-4 p-4">
  {/* Large, clear labels */}
  <label className="block text-base font-medium mb-2">
    URL
  </label>
  
  {/* Large input */}
  <input className="w-full py-3 px-4 text-base rounded-lg" />
  
  {/* Full-width button */}
  <button className="w-full py-3 text-base font-medium">
    Submit
  </button>
</form>
```

## 🚀 Performance Tips

### 1. Virtual Scrolling
For lists with >100 items:
```bash
npm install react-window
```

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={bookmarks.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <BookmarkCard bookmark={bookmarks[index]} />
    </div>
  )}
</FixedSizeList>
```

### 2. Image Optimization
```tsx
// Lazy loading
<img loading="lazy" src={url} />

// Responsive images
<img
  src={thumbnail}
  srcSet={`${thumbnail} 1x, ${thumbnail2x} 2x`}
  alt=""
/>

// Modern formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="" />
</picture>
```

### 3. Debounced Search
```tsx
import { useState, useEffect } from 'react';

const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  
  return () => clearTimeout(timer);
}, [query]);

// Use debouncedQuery for search
```

## 🔧 Testing Mobile Features

### Chrome DevTools
```
1. F12 → Toggle Device Mode (Ctrl+Shift+M)
2. Select device (iPhone 14 Pro, Pixel 7)
3. Enable touch simulation
4. Test in portrait and landscape
```

### Real Device Testing
```bash
# Start server with network access
npm run dev -- --host

# Find your IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from phone
http://YOUR_IP:5173
```

### Test Checklist
- [ ] Bottom nav accessible with thumb
- [ ] FAB doesn't block content
- [ ] Swipe gestures work smoothly
- [ ] Pull to refresh triggers correctly
- [ ] Inputs don't cause zoom (16px+)
- [ ] Safe areas respected on iPhone X+
- [ ] Haptic feedback on interactions
- [ ] Bottom sheets slide smoothly
- [ ] Long press activates correctly
- [ ] Portrait and landscape work
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll

## 📊 Common Mobile Patterns

### Filter Chips
```tsx
<div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
  {filters.map(filter => (
    <button
      className="px-4 py-2 rounded-full whitespace-nowrap"
    >
      {filter.label}
    </button>
  ))}
</div>
```

### Sticky Header
```tsx
<header className="sticky top-0 z-40 pt-safe-top bg-white">
  {/* Header content */}
</header>
```

### Empty States
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4">
  <Icon className="w-16 h-16 text-gray-400 mb-4" />
  <h3 className="text-lg font-semibold mb-2">No items yet</h3>
  <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
    Get started by adding your first item
  </p>
  <button>Add Item</button>
</div>
```

### Loading States
```tsx
{loading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
) : (
  <Content />
)}
```

## 🎯 Gesture Implementation

### Swipe Detection
```tsx
// src/hooks/useSwipeGesture.ts shows full implementation

const handlers = useSwipeGesture({
  onSwipeLeft: () => console.log('Swiped left'),
  onSwipeRight: () => console.log('Swiped right'),
  onSwipeUp: () => console.log('Swiped up'),
  onSwipeDown: () => console.log('Swiped down'),
});

<div {...handlers}>Swipeable content</div>
```

### Pinch to Zoom
```tsx
// Using @use-gesture/react
import { useGesture } from '@use-gesture/react';

const bind = useGesture({
  onPinch: ({ offset: [scale] }) => {
    // Handle zoom
  }
});

<div {...bind()}>Zoomable content</div>
```

## 📝 Accessibility on Mobile

### Focus Management
```tsx
// Auto-focus first input in bottom sheet
<input autoFocus />

// Trap focus in modal
// Use @radix-ui components (already installed)
```

### Keyboard Support
```tsx
// Handle Enter key
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }}
/>
```

### Screen Reader Support
```tsx
// Meaningful labels
<button aria-label="Add bookmark">
  <Plus />
</button>

// Live regions for dynamic updates
<div role="status" aria-live="polite">
  {message}
</div>
```

## 🌐 PWA Specific

### Install Prompt
```tsx
// Detect install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Show custom install UI
});
```

### Offline Detection
```tsx
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

{!isOnline && (
  <div className="bg-yellow-500 text-white p-2 text-center">
    You're offline
  </div>
)}
```

## 🎨 Animation Best Practices

### Use CSS Transforms
```css
/* ✅ Good - GPU accelerated */
.element {
  transform: translateX(100px);
  transition: transform 0.3s ease-out;
}

/* ❌ Bad - Layout thrashing */
.element {
  left: 100px;
  transition: left 0.3s ease-out;
}
```

### React Spring for Gestures
```tsx
import { useSpring, animated } from '@react-spring/web';

const [springs, api] = useSpring(() => ({ x: 0 }));

// Smooth gesture-driven animation
<animated.div style={springs}>
  {/* Content */}
</animated.div>
```

---

**💡 Remember**: Always design for mobile first, then progressively enhance for larger screens!
