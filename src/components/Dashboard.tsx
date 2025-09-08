import { useState, useEffect } from "react";
import { fetchVideosByKeyword } from "../lib/api";
import VideoCard from "./VideoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Search, PlayCircle, Clock, Eye } from "lucide-react";

function VideoSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="w-4 h-4 animate-pulse" />
          <span>Searching YouTube...</span>
        </div>
        <Progress className="w-full" value={undefined} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ keyword }: { keyword: string }) {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {keyword ? "No results found" : "Ready to explore YouTube"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {keyword
              ? `No videos found for "${keyword}". Try a different search term or check your spelling.`
              : "Search for videos using the search bar above to get started with your analysis"}
          </p>
          {!keyword && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                React JS
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                JavaScript
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Tutorial
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ keyword }: { keyword: string }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [pageTokens, setPageTokens] = useState<{ [page: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (page: number) => {
    if (!keyword) return;
    try {
      setLoading(true);
      setError(null);
      const token = pageTokens[page] || "";
      const data = await fetchVideosByKeyword(keyword, token);

      setVideos(data.videos);

      // Store page tokens for navigation
      setPageTokens((prev) => ({
        ...prev,
        [page + 1]: data.nextPageToken || "",
        [page - 1]: data.prevPageToken || "",
      }));

      setCurrentPage(page);

      // Estimate total pages (YouTube API doesn't give exact totalResults for search)
      if (totalPages === 0) {
        setTotalPages(10); // e.g. allow up to 10 pages of navigation
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      setVideos([]);
      setPageTokens({});
      setCurrentPage(1);
      setTotalPages(0);
      fetchVideos(1);
    }
  }, [keyword]);

  if (!keyword) {
    return <EmptyState keyword={keyword} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button onClick={() => fetchVideos(currentPage)} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return <EmptyState keyword={keyword} />;
  }

  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, video) => {
    return sum + parseInt(video.statistics?.viewCount || '0');
  }, 0);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Results for "{keyword}"</h2>
          <p className="text-muted-foreground">Page {currentPage} of {totalPages}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <PlayCircle className="w-3 h-3" />
            {totalVideos} videos
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Eye className="w-3 h-3" />
            {totalViews.toLocaleString()} views
          </Badge>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div key={video.id.videoId || video.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => fetchVideos(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchVideos(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => fetchVideos(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

