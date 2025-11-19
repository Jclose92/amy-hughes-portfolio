# How to Change Video Thumbnails in Google Drive

Your videos are stored in Google Drive, and Google Drive automatically generates thumbnails from your videos. Here's how to change them:

## Method 1: Change the Thumbnail Frame (Recommended)

Google Drive picks a frame from your video as the thumbnail. To change which frame:

1. **Upload a new version of the video** with the desired frame at the beginning
2. Or **edit your video** to have the best frame early in the video
3. Google Drive will regenerate the thumbnail automatically

## Method 2: Use a Custom Thumbnail (If Supported)

Unfortunately, Google Drive doesn't natively support custom thumbnails for videos like YouTube does. The thumbnail is always auto-generated from the video content.

## Method 3: Use YouTube Instead (Alternative)

If you need custom thumbnails:

1. Upload your videos to YouTube
2. Set custom thumbnails in YouTube
3. Update the code to use YouTube embeds instead of Google Drive

**To switch to YouTube:**
- Change the video IDs in your Google Drive folders to YouTube video IDs
- Update the embed URL format in the code from:
  ```
  https://drive.google.com/file/d/${id}/preview
  ```
  to:
  ```
  https://www.youtube.com/embed/${id}
  ```

## Current Implementation

Your site currently uses:
```
https://drive.google.com/thumbnail?id=${videoId}&sz=w400
```

This URL automatically fetches the thumbnail that Google Drive generates. You cannot customize this URL to show a different image - it always shows Google Drive's auto-generated thumbnail.

## Best Practice

**For best results:**
1. Edit your video so the most appealing frame appears within the first few seconds
2. Re-upload to Google Drive
3. Wait a few minutes for Google Drive to regenerate the thumbnail
4. Clear your browser cache and refresh the page

## Technical Note

The thumbnail size `sz=w400` in the URL means "width 400 pixels". Google Drive scales the thumbnail automatically. You can change this number, but it won't change which frame is shown - only the size of the thumbnail image.

---

**Bottom line:** To change what appears in the thumbnail, you need to change the video content itself, as Google Drive auto-generates thumbnails from the video frames.
