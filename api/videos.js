// Vercel Serverless Function — Single Source of Truth: Upstash Redis / Vercel KV
// Route: /api/videos

const INITIAL_SEED_VIDEOS = [
  {
    id: "vid_1787653848011",
    section: "aiTrack",
    title: "BM Studio",
    badge: "Bargad Song Edit",
    subtitle: "",
    videoUrl: "https://res.cloudinary.com/xypda8sw/video/upload/q_auto,vc_auto,w_720/v1787653846/pdfsfqewjd3sl9zdvr9j.mp4",
    thumbClass: "v1"
  },
  {
    id: "vid_1787653671082",
    section: "colorTrack",
    title: "Vedant Beladiya",
    badge: "Log to Colour Grad",
    subtitle: "",
    videoUrl: "https://res.cloudinary.com/xypda8sw/video/upload/q_auto,vc_auto,w_720/v1787653669/vkpw2ztgzrw2m5lp5aon.mp4",
    thumbClass: "v1"
  },
  {
    id: "vid_1787645827738",
    section: "colorTrack",
    title: "Vedant Beladiya",
    badge: "Log to Colour Grad",
    subtitle: "Graded In Premier Pro",
    videoUrl: "https://res.cloudinary.com/xypda8sw/video/upload/q_auto,vc_auto,w_720/v1787645826/xthkjuswpslg5zkptoa6.mp4",
    thumbClass: "v1"
  }
];

const KV_KEY = "portfolio_videos";

// Get Upstash Redis / Vercel KV credentials from process.env
function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return { url, token };
}

// Execute command on Upstash Redis REST API
async function executeKvCommand(commandArray) {
  const config = getKvConfig();
  if (!config) {
    throw new Error("DATABASE_NOT_CONFIGURED: Missing KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) environment variables in Vercel.");
  }

  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commandArray)
  });

  if (!res.ok) {
    throw new Error(`Database HTTP error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`Database error: ${data.error}`);
  }

  return data.result;
}

// Read videos from the primary database
async function getVideosFromDb() {
  const raw = await executeKvCommand(["GET", KV_KEY]);
  
  // If the key has never been initialized in the database (raw === null), perform one-time seed
  if (raw === null || raw === undefined) {
    await executeKvCommand(["SET", KV_KEY, JSON.stringify(INITIAL_SEED_VIDEOS)]);
    return INITIAL_SEED_VIDEOS;
  }

  // Parse stored JSON
  let parsed;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error("Failed to parse database records: " + e.message);
    }
  } else {
    parsed = raw;
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Corrupted database format: expected Array but got " + typeof parsed);
  }

  // Empty array [] is completely valid!
  return parsed;
}

// Save videos to primary database and verify write confirmation
async function saveVideosToDb(videos) {
  if (!Array.isArray(videos)) {
    throw new Error("Invalid payload: videos must be an Array");
  }

  const result = await executeKvCommand(["SET", KV_KEY, JSON.stringify(videos)]);
  if (result !== "OK") {
    throw new Error(`Database write failed to confirm (received: ${JSON.stringify(result)})`);
  }

  return true;
}

module.exports = async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Strict anti-caching headers so Vercel CDN and browsers never cache dynamic portfolio state
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const kvConfig = getKvConfig();
  if (!kvConfig) {
    return res.status(503).json({
      success: false,
      error: "DATABASE_NOT_CONFIGURED: Upstash / Vercel KV environment variables are not set. Please add KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) to Vercel Project Settings -> Environment Variables."
    });
  }

  try {
    // GET: Retrieve all videos
    if (req.method === "GET") {
      const videos = await getVideosFromDb();
      return res.status(200).json({ success: true, count: videos.length, videos });
    }

    // Parse request body
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (_) {}
    }

    // POST: Add new video (or reset/seed if explicitly requested)
    if (req.method === "POST") {
      if (body && (body.reset || (Array.isArray(body.videos) && !body.video))) {
        const resetVideos = Array.isArray(body.videos) ? body.videos : INITIAL_SEED_VIDEOS;
        await saveVideosToDb(resetVideos);
        return res.status(200).json({ success: true, message: "Videos reset to default", count: resetVideos.length, videos: resetVideos });
      }

      const videoData = body && body.video ? body.video : body;
      if (!videoData || !videoData.videoUrl) {
        return res.status(400).json({ success: false, error: "Missing required field: videoUrl" });
      }

      const newVideo = {
        id: videoData.id || `vid_${Date.now()}`,
        section: videoData.section || "aiTrack",
        title: videoData.title || "Portfolio Reel",
        badge: videoData.badge || "Reel",
        subtitle: videoData.subtitle || "",
        videoUrl: videoData.videoUrl,
        thumbClass: videoData.thumbClass || "v1"
      };

      const currentVideos = await getVideosFromDb();
      const existingIdx = currentVideos.findIndex(v => v.id === newVideo.id);
      if (existingIdx >= 0) {
        currentVideos[existingIdx] = Object.assign({}, currentVideos[existingIdx], newVideo);
      } else {
        currentVideos.unshift(newVideo);
      }

      await saveVideosToDb(currentVideos);
      return res.status(201).json({ success: true, message: "Video added successfully", video: newVideo, count: currentVideos.length, videos: currentVideos });
    }

    // PUT: Update an existing video
    if (req.method === "PUT") {
      const videoData = body && body.video ? body.video : body;
      if (!videoData || !videoData.id) {
        return res.status(400).json({ success: false, error: "Missing required field: id" });
      }

      const currentVideos = await getVideosFromDb();
      const existingIdx = currentVideos.findIndex(v => v.id === videoData.id);
      if (existingIdx === -1) {
        currentVideos.unshift(videoData);
      } else {
        currentVideos[existingIdx] = Object.assign({}, currentVideos[existingIdx], videoData);
      }

      await saveVideosToDb(currentVideos);
      return res.status(200).json({ success: true, message: "Video updated successfully", video: videoData, count: currentVideos.length, videos: currentVideos });
    }

    // DELETE: Delete a video by ID
    if (req.method === "DELETE") {
      const id = req.query && req.query.id ? req.query.id : (body && body.id ? body.id : null);
      if (!id) {
        return res.status(400).json({ success: false, error: "Missing required query parameter: id" });
      }

      const currentVideos = await getVideosFromDb();
      const initialCount = currentVideos.length;
      const filtered = currentVideos.filter(v => v.id !== id);

      if (filtered.length === initialCount) {
        return res.status(404).json({ success: false, error: `Video with ID "${id}" not found in database`, videos: currentVideos });
      }

      await saveVideosToDb(filtered);
      return res.status(200).json({ success: true, message: "Video deleted successfully", deletedId: id, count: filtered.length, videos: filtered });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      success: false,
      error: "Database operation failed: " + error.message
    });
  }
};
