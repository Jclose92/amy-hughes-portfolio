# Performance Optimization Guide

## Current Performance Issues

Your work page loads slowly because:

1. **Multiple embedded iframes** - Each video loads a full Google Drive player
2. **All videos load at once** - No lazy loading for iframes
3. **Multiple API calls** - 6 separate fetch requests on page load
4. **Large images** - No optimization for thumbnails
5. **No caching** - Data fetched fresh every time

---

## ✅ Optimizations Already Implemented

### 1. Loading Screen
- Shows pulsing AH logo while content loads
- Hides once showreels and voice demos are ready

### 2. Image Optimization
- Using Next.js `Image` component with lazy loading
- Thumbnails only load when near viewport

### 3. Bio Caching
- Bio cached for 5 minutes to reduce API calls

---

## 🚀 Additional Optimizations You Can Implement

### Option 1: Lazy Load Video Iframes (RECOMMENDED)

**Problem:** All video iframes load immediately, even if not visible

**Solution:** Only load iframe when user scrolls near it

**How to implement:**
- Use Intersection Observer API
- Replace iframe with thumbnail initially
- Load iframe only when thumbnail comes into view

**Expected improvement:** 50-70% faster initial page load

### Option 2: Reduce Number of Videos Per Gallery

**Problem:** Too many videos loading at once

**Solution:** Show only 5-10 most recent videos per gallery

**How to implement:**
- In Google Drive, keep only your best/recent work in each folder
- Move older content to archive folders
- Or modify the API to return only first 10 items

**Expected improvement:** 40-60% faster load time

### Option 3: Use Video Thumbnails Instead of Embedded Players

**Problem:** Embedded players are heavy and slow

**Solution:** Show thumbnails by default, load player on click

**Current implementation:** Videos are already embedded
**Better approach:** Show thumbnail → click to play inline → button to open lightbox

**Expected improvement:** 60-80% faster initial load

### Option 4: Implement Progressive Loading

**Problem:** All galleries load simultaneously

**Solution:** Load galleries one at a time as user scrolls

**How to implement:**
- Load showreels first (above fold)
- Load other galleries when they come into view
- Use Intersection Observer

**Expected improvement:** 30-50% faster perceived performance

### Option 5: Optimize Google Drive API Calls

**Problem:** 6 separate API calls on page load

**Solution:** Batch requests or cache responses

**How to implement:**
- Cache API responses in browser localStorage
- Set 5-10 minute expiry
- Refresh in background

**Expected improvement:** 20-40% faster on repeat visits

---

## 🎯 Quick Wins (Easy to Implement)

### 1. Reduce Video Count
**Effort:** Low | **Impact:** High

Go to your Google Drive folders and:
- Keep only 5-8 videos per category
- Move older work to "Archive" folders
- Focus on your best recent work

### 2. Compress Video Files
**Effort:** Medium | **Impact:** Medium

Before uploading to Google Drive:
- Use HandBrake or similar tool
- Target: 1080p, H.264, 5-10 Mbps bitrate
- Smaller files = faster loading

### 3. Use Smaller Thumbnail Sizes
**Effort:** Low | **Impact:** Low-Medium

Currently using `sz=w400` for thumbnails
Could reduce to `sz=w300` for faster loading

---

## 🔧 Technical Optimizations (Requires Code Changes)

### 1. Implement Lazy Loading for Iframes

Replace immediate iframe loading with lazy loading:

```typescript
// Instead of always showing iframe:
<iframe src={`.../${item.id}/preview`} />

// Show thumbnail first, load iframe on intersection:
{isInView ? (
  <iframe src={`.../${item.id}/preview`} />
) : (
  <img src={thumbnail} />
)}
```

### 2. Add Request Caching

Cache API responses in browser:

```typescript
const cachedData = localStorage.getItem('gallery-data')
const cacheTime = localStorage.getItem('gallery-cache-time')

if (cachedData && Date.now() - cacheTime < 300000) {
  // Use cached data (5 min cache)
  setGallery(JSON.parse(cachedData))
} else {
  // Fetch fresh data
  fetch('/api/media')
}
```

### 3. Implement Virtual Scrolling

For galleries with many items, only render visible items:
- Use `react-window` or `react-virtualized`
- Render only items in viewport + buffer
- Dramatically improves performance with 20+ items

---

## 📊 Performance Metrics to Track

Use Chrome DevTools → Performance tab:

1. **First Contentful Paint (FCP)** - Should be < 1.5s
2. **Largest Contentful Paint (LCP)** - Should be < 2.5s
3. **Time to Interactive (TTI)** - Should be < 3.5s
4. **Total Blocking Time (TBT)** - Should be < 300ms

Current estimates:
- FCP: ~2-3s (could be 0.5-1s)
- LCP: ~4-6s (could be 1.5-2.5s)
- TTI: ~6-8s (could be 2-3s)

---

## 🎬 Recommended Action Plan

### Phase 1: Immediate (No Code Changes)
1. ✅ Reduce videos to 5-8 per gallery
2. ✅ Compress video files before upload
3. ✅ Remove any duplicate or low-quality content

### Phase 2: Quick Wins (Minor Code Changes)
1. Reduce thumbnail size to `sz=w300`
2. Add localStorage caching for API responses
3. Increase API cache duration to 10 minutes

### Phase 3: Major Improvements (Significant Changes)
1. Implement lazy loading for video iframes
2. Add Intersection Observer for progressive loading
3. Consider switching to thumbnail-first approach

---

## 💡 What You Can Do Right Now

### 1. Audit Your Content
- How many videos are in each Google Drive folder?
- Are they all necessary?
- Can you archive older work?

### 2. Check Video File Sizes
- Right-click videos in Google Drive → Details
- If videos are > 50MB, consider compressing them
- Target: 10-30MB per video

### 3. Test on Slow Connection
- Chrome DevTools → Network tab → Throttling
- Set to "Slow 3G" and reload page
- See which content loads slowly

### 4. Prioritize Content
- Which galleries are most important?
- Load those first, others later
- Consider removing less important sections

---

## 🔍 Monitoring Performance

After making changes, test with:

1. **Chrome Lighthouse**
   - Right-click → Inspect → Lighthouse tab
   - Run performance audit
   - Target: Score > 80

2. **PageSpeed Insights**
   - Visit: https://pagespeed.web.dev/
   - Enter your URL
   - Check mobile and desktop scores

3. **Real User Testing**
   - Ask friends to visit on different devices
   - Get feedback on load times
   - Test on mobile data (not just WiFi)

---

## 📝 Summary

**Biggest Impact:**
1. Reduce number of videos (5-8 per gallery)
2. Compress video files before upload
3. Implement lazy loading for iframes

**Quick Wins:**
1. Remove old/duplicate content
2. Cache API responses
3. Reduce thumbnail sizes

**Long Term:**
1. Switch to thumbnail-first approach
2. Implement progressive loading
3. Add virtual scrolling for large galleries

---

**Want me to implement any of these optimizations? Let me know which approach you prefer!**
