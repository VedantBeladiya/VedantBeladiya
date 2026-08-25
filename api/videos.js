// Vercel Serverless Function — Unified Video Portfolio Backend API
// Route: /api/videos
// Handles persistent CRUD for video portfolio metadata without client-side secrets.

const SEED_VIDEOS = [
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

const DEFAULT_CLOUD_DB = "https://api.restful-api.dev/objects/ff8081819ff5b11001a037fbb94a199b";

// --- Storage Adapters ---

// 1. Upstash Redis / Vercel KV Adapter
async function getFromKv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/portfolio_videos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.result) return null;
    const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.error("KV read error:", err);
    return null;
  }
}

async function saveToKv(videos) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/portfolio_videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(JSON.stringify(videos))
    });
    return res.ok;
  } catch (err) {
    console.error("KV write error:", err);
    return false;
  }
}

// 2. Cloud DB Adapter (Default & Environment Variable)
async function getFromCloudDb() {
  const endpoint = process.env.CLOUD_DB_URL || DEFAULT_CLOUD_DB;
  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.data && Array.isArray(data.data.videos)) {
      return data.data.videos;
    }
    if (Array.isArray(data)) return data;
    return null;
  } catch (err) {
    console.error("Cloud DB read error:", err);
    return null;
  }
}

async function saveToCloudDb(videos) {
  const endpoint = process.env.CLOUD_DB_URL || DEFAULT_CLOUD_DB;
  try {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "vedant_portfolio_videos",
        data: { videos: videos }
      })
    });
    return res.ok;
  } catch (err) {
    console.error("Cloud DB write error:", err);
    return false;
  }
}

// 3. Optional Server-Side GitHub Backup (Requires GITHUB_TOKEN in Vercel Env)
async function syncToGitHub(videos) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPO || "VedantBeladiya/VedantBeladiya";
  if (!token) return;

  try {
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/videos.json?ref=main`, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "Vercel-Serverless-Function"
      }
    });
    const getData = await getRes.json();
    const sha = getData && getData.sha ? getData.sha : undefined;

    const contentBase64 = Buffer.from(JSON.stringify(videos, null, 2)).toString("base64");
    const payload = {
      message: "Sync portfolio videos from admin portal",
      content: contentBase64
    };
    if (sha) payload.sha = sha;

    await fetch(`https://api.github.com/repos/${repo}/contents/videos.json`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Vercel-Serverless-Function"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("GitHub backup notice:", err.message);
  }
}

// Unified Read
async function loadVideos() {
  // 1. Try Vercel KV / Upstash Redis
  const kvVideos = await getFromKv();
  if (kvVideos && kvVideos.length > 0) return kvVideos;

  // 2. Try Cloud DB
  const cloudVideos = await getFromCloudDb();
  if (cloudVideos && cloudVideos.length > 0) {
    // If KV is configured, backfill into KV
    if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
      await saveToKv(cloudVideos);
    }
    return cloudVideos;
  }

  // 3. Fallback to SEED_VIDEOS
  return SEED_VIDEOS;
}

// Unified Write
async function persistVideos(videos) {
  const results = await Promise.allSettled([
    saveToKv(videos),
    saveToCloudDb(videos),
    syncToGitHub(videos)
  ]);
  return results.some(r => r.status === "fulfilled" && r.value !== false);
}

// Serverless Handler
module.exports = async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Anti-caching headers for real-time consistency across all global users
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    // GET: Retrieve all portfolio videos
    if (req.method === "GET") {
      const videos = await loadVideos();
      return res.status(200).json({ success: true, count: videos.length, videos });
    }

    // Parse body if JSON string
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (_) {}
    }

    // POST: Add a new video or reset
    if (req.method === "POST") {
      if (body && (body.reset || (Array.isArray(body.videos) && !body.video))) {
        const resetVideos = Array.isArray(body.videos) ? body.videos : SEED_VIDEOS;
        await persistVideos(resetVideos);
        return res.status(200).json({ success: true, message: "Videos updated/reset", videos: resetVideos });
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

      const videos = await loadVideos();
      // Insert at the beginning of the list
      const existingIdx = videos.findIndex(v => v.id === newVideo.id);
      if (existingIdx >= 0) {
        videos[existingIdx] = Object.assign({}, videos[existingIdx], newVideo);
      } else {
        videos.unshift(newVideo);
      }

      await persistVideos(videos);
      return res.status(201).json({ success: true, message: "Video added successfully", video: newVideo, videos });
    }

    // PUT: Update an existing video
    if (req.method === "PUT") {
      const videoData = body && body.video ? body.video : body;
      if (!videoData || !videoData.id) {
        return res.status(400).json({ success: false, error: "Missing required field: id" });
      }

      const videos = await loadVideos();
      const existingIdx = videos.findIndex(v => v.id === videoData.id);
      if (existingIdx === -1) {
        // If not found, append
        videos.unshift(videoData);
      } else {
        videos[existingIdx] = Object.assign({}, videos[existingIdx], videoData);
      }

      await persistVideos(videos);
      return res.status(200).json({ success: true, message: "Video updated successfully", video: videos[existingIdx >= 0 ? existingIdx : 0], videos });
    }

    // DELETE: Delete a video by ID
    if (req.method === "DELETE") {
      const id = req.query && req.query.id ? req.query.id : (body && body.id ? body.id : null);
      if (!id) {
        return res.status(400).json({ success: false, error: "Missing required query parameter: id" });
      }

      let videos = await loadVideos();
      const initialCount = videos.length;
      videos = videos.filter(v => v.id !== id);

      if (videos.length === initialCount) {
        return res.status(404).json({ success: false, error: "Video not found", videos });
      }

      await persistVideos(videos);
      return res.status(200).json({ success: true, message: "Video deleted successfully", deletedId: id, videos });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ success: false, error: "Internal server error: " + error.message });
  }
};
