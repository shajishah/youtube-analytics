import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Comment from "@/components/Comment";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  ExternalLink,
  BarChart3,
  TrendingUp
} from "lucide-react";

function VideoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded" />
        <Skeleton className="h-8 flex-1" />
      </div>
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K';
  }
  return n.toString();
}

function getTimeAgo(publishedAt: string): string {
  const published = new Date(publishedAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - published.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

        // Video details
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${apiKey}`
        );
        const videoData = await videoRes.json();
        setVideo(videoData.items[0]);

        // Comments with replies
        try {
          const commentRes = await fetch(
            `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${id}&maxResults=20&order=relevance&key=${apiKey}`
          );
          const commentData = await commentRes.json();
          
          // Process comments to include replies
          const processedComments = (commentData.items || []).map((comment: any) => {
            const commentSnippet = comment.snippet.topLevelComment.snippet;
            let replies = [];
            
            // If comment has replies, process them
            if (comment.snippet.totalReplyCount > 0 && comment.replies && comment.replies.comments) {
              replies = comment.replies.comments.map((reply: any) => ({
                id: reply.id,
                snippet: reply.snippet,
                isReply: true,
                parentId: comment.id
              }));
            }
            
            return {
              id: comment.id,
              snippet: commentSnippet,
              replies: replies,
              totalReplyCount: comment.snippet.totalReplyCount || 0,
              isReply: false
            };
          });
          
          console.log('Processed comments:', processedComments);
          setComments(processedComments);
        } catch (commentError) {
          console.warn("Could not fetch comments:", commentError);
          setComments([]);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load video details");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <VideoSkeleton />;

  if (error || !video) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="text-center py-12 border-destructive">
          <CardContent>
            <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error || "Video not found"}</p>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { snippet, statistics } = video;
  const viewCount = parseInt(statistics.viewCount || '0');
  const likeCount = parseInt(statistics.likeCount || '0');
  const commentCount = parseInt(statistics.commentCount || '0');
  const timeAgo = getTimeAgo(snippet.publishedAt);
  const channelInitial = snippet.channelTitle?.charAt(0)?.toUpperCase() || 'C';

  // Enhanced Chart config with better styling
  const chartOptions = {
    title: {
      text: "Engagement Metrics",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold"
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.axisValue}: ${formatNumber(data.value)}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%'
    },
    xAxis: {
      type: "category",
      data: ["Views", "Likes", "Comments"],
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatNumber(value)
      }
    },
    series: [
      {
        data: [viewCount, likeCount, commentCount],
        type: "bar",
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#1d4ed8' }
            ]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => formatNumber(params.value)
        }
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Published {timeAgo}</span>
          </div>
        </div>

        {/* Video Player */}
        <Card className="mb-6 overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${id}?rel=0`}
              title={snippet.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl leading-tight">{snippet.title}</CardTitle>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={snippet.thumbnails?.default?.url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {channelInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{snippet.channelTitle}</p>
                      <p className="text-sm text-muted-foreground">Published {timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{formatNumber(viewCount)} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{formatNumber(likeCount)} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{formatNumber(commentCount)} comments</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{snippet.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({comments.length})
                </CardTitle>
                <CardDescription>
                  Join the conversation with other viewers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="pb-6 border-b border-border last:border-0">
                          <Comment comment={comment} />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No comments available for this video.</p>
                    <p className="text-sm">Comments may be disabled or not yet loaded.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Engagement Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Views</span>
                    </div>
                    <Badge variant="secondary">{formatNumber(viewCount)}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Likes</span>
                    </div>
                    <Badge variant="secondary">{formatNumber(likeCount)}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Comments</span>
                    </div>
                    <Badge variant="secondary">{formatNumber(commentCount)}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Engagement Rate</span>
                    </div>
                    <Badge variant="secondary">
                      {((likeCount + commentCount) / viewCount * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Chart</CardTitle>
                <CardDescription>Visual breakdown of video performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ReactECharts option={chartOptions} style={{ height: "100%" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


