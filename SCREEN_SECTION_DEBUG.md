# Screen Section Spacing Debugging Guide

## Current Structure

The gallery items are structured like this:

```
<div className="gallery-item-container" style={{ display: 'flex', flexDirection: 'column' }}>
  <div className="gallery-item" style={{ marginBottom: '0.5rem' }}>
    <div style={{ overflow: 'hidden', border: '2px solid #C28950' }}>
      <iframe [VIDEO] />
      <button [POP-OUT] />
    </div>
  </div>
  <div className="gallery-caption" style={{ width: 'XXXpx', maxWidth: 'XXXpx' }}>
    <p className="gallery-title">Title</p>
    <p className="gallery-description">Description</p>
  </div>
</div>
```

## What Should Happen

1. Video container: 356px × 200px (for videos) or 200px × 200px (for images)
2. 0.5rem gap (8px)
3. Caption directly below

## Potential Issues to Check

### Issue 1: Iframe extending beyond container
**Check in browser DevTools:**
1. Right-click on a video in Screen Work gallery
2. Choose "Inspect Element"
3. Look at the computed height of:
   - The outer `<div>` with class `gallery-item`
   - The inner `<div>` with the bronze border
   - The `<iframe>` inside

**Expected:** All should be 200px height
**If not:** The iframe is overflowing

### Issue 2: Caption container stretching
**Check in browser DevTools:**
1. Right-click on the text below a video
2. Choose "Inspect Element"
3. Look at the computed dimensions of `gallery-caption`

**Expected:** Width should match video (356px for video, 200px for image)
**If not:** Something is causing it to expand

### Issue 3: CSS padding/margin from gallery-item class
**Check in browser DevTools:**
1. Find element with class `gallery-item`
2. Look at the "Computed" or "Box Model" tab
3. Check for any unexpected padding or height

## How to Help Me Debug

Please check the following in your browser DevTools and let me know:

1. **What is the actual computed height of the video container?**
   - Right-click video → Inspect → Look at the div with `border: 2px solid #C28950`
   - What does it say under "Computed" → "Height"?

2. **What is the actual computed height of the iframe inside?**
   - Same element, find the `<iframe>` child
   - What height does it show?

3. **Take a screenshot of the Elements panel** showing:
   - The HTML structure of one video item
   - The Styles panel on the right
   - The Computed/Box Model

This will help me understand exactly what's happening!

## Quick Test

Try adding this temporarily to see if it helps identify the issue:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Paste this code:

```javascript
document.querySelectorAll('.gallery-item').forEach(item => {
  if (item.querySelector('iframe')) {
    console.log('Video container height:', item.offsetHeight);
    console.log('Iframe height:', item.querySelector('iframe').offsetHeight);
    console.log('Next sibling (caption):', item.nextElementSibling);
  }
});
```

This will log all video heights. Let me know what you see!

## Alternative: Add Temporary Borders

If you can edit the code temporarily, change this in `InfiniteGallery.tsx`:

```typescript
<div className="gallery-caption" style={{ 
  width: `${itemWidth}px`, 
  maxWidth: `${itemWidth}px`,
  border: '2px solid red'  // ADD THIS LINE
}}>
```

This will show you exactly where the caption box is. If there's a huge gap, you'll see the red border far below the video.

---

Let me know what you find and I can provide a more targeted fix!
