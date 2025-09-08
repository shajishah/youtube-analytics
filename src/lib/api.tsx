export async function fetchVideosByKeyword(keyword: string, pageToken: string = "") {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Step 1: Search videos
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
    keyword
  )}&pageToken=${pageToken}&key=${apiKey}`;

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error("Failed to fetch videos");
  const searchData = await searchRes.json();

  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");

  // Step 2: Fetch video statistics
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`;
  const statsRes = await fetch(statsUrl);
  if (!statsRes.ok) throw new Error("Failed to fetch video stats");
  const statsData = await statsRes.json();

  // Merge snippet + stats
  const merged = searchData.items.map((item: any, index: number) => ({
    ...item,
    statistics: statsData.items[index]?.statistics || {},
  }));

  return {
    videos: merged,
    nextPageToken: searchData.nextPageToken,
    prevPageToken: searchData.prevPageToken,
  };
}
