# Complete Video Compression Guide

## Why Compress Videos?

**Problem:** Large video files (50-200MB) make your website slow
**Solution:** Compress to 10-30MB without noticeable quality loss
**Result:** 3-5x faster loading times!

---

## Method 1: HandBrake (FREE - Recommended)

### Step 1: Download HandBrake
1. Go to [handbrake.fr](https://handbrake.fr/)
2. Click "Download HandBrake"
3. Choose your operating system (Mac/Windows/Linux)
4. Install the application

### Step 2: Open Your Video
1. Launch HandBrake
2. Click "Open Source" or "File"
3. Select your video file
4. Wait for it to load (you'll see a preview)

### Step 3: Choose Settings

**Quick Method (Recommended):**
1. On the right side, find "Presets"
2. Select **"Fast 1080p30"** (for most videos)
3. Or **"Fast 720p30"** (for even smaller files)

**Custom Method (More Control):**
1. Go to "Video" tab
2. Set these options:
   - **Video Codec:** H.264 (x264)
   - **Framerate:** 30 (or "Same as source")
   - **Quality:** Constant Quality
   - **RF:** 22-24 (lower = better quality, larger file)

### Step 4: Choose Output Location
1. At the bottom, click "Browse"
2. Choose where to save the compressed video
3. Give it a name (e.g., "showreel-compressed.mp4")

### Step 5: Start Encoding
1. Click the green "Start Encode" button at the top
2. Wait for it to finish (may take 5-30 minutes depending on video length)
3. Check the file size - should be much smaller!

### Step 6: Compare Quality
1. Watch both versions
2. If compressed version looks good → use it!
3. If quality is too low → try again with RF 20-21

---

## Method 2: Online Tools (No Installation)

### Option A: CloudConvert (Free, Easy)
1. Go to [cloudconvert.com](https://cloudconvert.com/)
2. Click "Select File" and upload your video
3. Choose output format: **MP4**
4. Click "Convert"
5. Download the compressed file

### Option B: FreeConvert (Free, Simple)
1. Go to [freeconvert.com/video-compressor](https://www.freeconvert.com/video-compressor)
2. Upload your video
3. Choose compression level: **Medium** or **High**
4. Click "Compress Now"
5. Download result

### Option C: Clideo (Free, User-Friendly)
1. Go to [clideo.com/compress-video](https://clideo.com/compress-video)
2. Click "Choose file"
3. Upload your video
4. Wait for automatic compression
5. Download compressed video

**Note:** Online tools have file size limits (usually 500MB-2GB)

---

## Method 3: Mac Users - QuickTime + iMovie

### Using iMovie (Built-in on Mac):
1. Open iMovie
2. Create new project
3. Import your video
4. Drag video to timeline
5. Click "Share" → "File"
6. Choose quality: **High** (not Best)
7. Resolution: **1080p**
8. Export

---

## Method 4: Windows Users - Built-in Tools

### Using Windows Photos App:
1. Right-click video → "Open with" → "Photos"
2. Click "Edit & Create" → "Trim"
3. Even if not trimming, click "Save a copy"
4. Windows will compress automatically

### Using VLC Media Player (Free):
1. Download VLC if you don't have it
2. Open VLC → Media → Convert/Save
3. Add your video file
4. Click "Convert/Save"
5. Profile: Choose "Video - H.264 + MP3 (MP4)"
6. Click "Start"

---

## Recommended Settings for Your Website

### Target Specifications:
- **Resolution:** 1920x1080 (1080p) or 1280x720 (720p)
- **Bitrate:** 5-8 Mbps (video)
- **Framerate:** 30 fps
- **Audio:** 128-192 kbps
- **Codec:** H.264 (most compatible)
- **File Size:** 10-30MB per video

### Quality Levels:

**High Quality (Showreels):**
- Resolution: 1080p
- RF: 20-22
- Bitrate: 8 Mbps
- File size: ~25-30MB per minute

**Medium Quality (General Work):**
- Resolution: 1080p
- RF: 22-24
- Bitrate: 5-6 Mbps
- File size: ~15-20MB per minute

**Lower Quality (Quick Clips):**
- Resolution: 720p
- RF: 24-26
- Bitrate: 3-4 Mbps
- File size: ~10-15MB per minute

---

## HandBrake Settings Explained

### RF (Rate Factor):
- **18-20:** Excellent quality, larger files
- **22-24:** Great quality, good compression (RECOMMENDED)
- **26-28:** Good quality, smaller files
- **30+:** Lower quality, very small files

### Presets:
- **Fast 1080p30:** Best for most videos
- **Fast 720p30:** Smaller files, still good quality
- **HQ 1080p30:** Higher quality, larger files
- **Super HQ 1080p30:** Best quality, biggest files

### Video Codec:
- **H.264 (x264):** Most compatible, recommended
- **H.265 (x265):** Better compression, newer
- **VP9:** Good for web, less compatible

---

## Before & After Comparison

### Example 1: Showreel
```
Before: 150MB, 1080p, 3 minutes
After:  25MB, 1080p, 3 minutes
Compression: 83% smaller
Quality: Barely noticeable difference
```

### Example 2: Scene Clip
```
Before: 80MB, 1080p, 1 minute
After:  12MB, 1080p, 1 minute
Compression: 85% smaller
Quality: No visible difference
```

### Example 3: Voice Demo Video
```
Before: 60MB, 1080p, 2 minutes
After:  15MB, 720p, 2 minutes
Compression: 75% smaller
Quality: Perfect for voice work
```

---

## Batch Compression (Multiple Videos)

### HandBrake Queue:
1. Open HandBrake
2. Add first video
3. Choose settings
4. Click "Add to Queue" (not "Start")
5. Repeat for all videos
6. Click "Start Queue"
7. Let it run (can take hours for many videos)

### Automator (Mac Only):
1. Open Automator
2. Create new "Workflow"
3. Add "Get Specified Finder Items"
4. Add your videos
5. Add "Encode Media"
6. Choose settings
7. Save and run

---

## Quality Check Checklist

After compressing, check:
- [ ] File size reduced by at least 50%
- [ ] Video plays smoothly
- [ ] No pixelation or artifacts
- [ ] Audio is clear
- [ ] Colors look natural
- [ ] Text/details are readable

If any issues:
- Try lower RF value (better quality)
- Use higher bitrate
- Check original video quality

---

## Common Mistakes to Avoid

❌ **Don't:**
- Compress already compressed videos (quality degrades)
- Use RF below 18 (files too large)
- Use RF above 28 (quality too low)
- Export at higher resolution than original
- Forget to check the output!

✅ **Do:**
- Keep original files as backup
- Test compressed version before uploading
- Use consistent settings for all videos
- Name files clearly (e.g., "showreel-2024-compressed.mp4")

---

## Troubleshooting

### "File is still too large"
- Try RF 26 instead of 22
- Reduce resolution to 720p
- Check video length (longer = larger)
- Use 2-pass encoding in HandBrake

### "Quality is too low"
- Use RF 20 instead of 24
- Increase bitrate
- Use "HQ" preset instead of "Fast"
- Check original video quality

### "Compression takes forever"
- Use "Fast" preset (not "HQ")
- Close other applications
- Compress overnight
- Consider online tools for quick jobs

### "Audio is out of sync"
- Use "Auto Passthru" for audio codec
- Match framerate to original
- Update HandBrake to latest version

---

## Quick Reference Card

```
RECOMMENDED SETTINGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Preset:     Fast 1080p30
Codec:      H.264 (x264)
Quality:    RF 22-24
Framerate:  30 fps
Audio:      AAC, 160 kbps
Format:     MP4

TARGET:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File Size:  10-30MB per video
Resolution: 1080p (or 720p)
Length:     1-3 minutes
Quality:    Excellent, web-optimized
```

---

## Next Steps

1. **Download HandBrake** (5 minutes)
2. **Compress one test video** (10 minutes)
3. **Check quality and file size** (2 minutes)
4. **If good, compress all videos** (1-2 hours)
5. **Upload to Google Drive** (30 minutes)
6. **Test website speed** (5 minutes)

**Total time:** 2-3 hours for all videos
**Result:** Website loads 3-5x faster! 🚀

---

## Need Help?

If you get stuck:
1. Check HandBrake documentation: [handbrake.fr/docs](https://handbrake.fr/docs/)
2. Watch tutorial: Search "HandBrake tutorial" on YouTube
3. Try online tool instead (easier but less control)
4. Ask me for help with specific issues!

---

**Remember: Always keep your original files as backup!**
