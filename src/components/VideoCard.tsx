import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  Calendar,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: any;
  className?: string;
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

function formatDuration(duration: string): string {
  // YouTube duration format: PT4M13S -> 4:13
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getTimeAgo(publishedAt: string): string {
  const published = new Date(publishedAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - published.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

export default function VideoCard({ video, className }: VideoCardProps) {
  const videoId = video.id.videoId || video.id;
  const { snippet, statistics = {}, contentDetails = {} } = video;
  
  const viewCount = statistics.viewCount || '0';
  const likeCount = statistics.likeCount || '0';
  const commentCount = statistics.commentCount || '0';
  const duration = contentDetails.duration || '';
  
  const channelInitial = snippet.channelTitle?.charAt(0)?.toUpperCase() || 'C';
  const timeAgo = getTimeAgo(snippet.publishedAt);

  return (
    <Card className={cn(
      "group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur-sm",
      className
    )}>
      <div className="relative overflow-hidden">
        <img
          src={snippet.thumbnails.medium.url}
          alt={snippet.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Duration Badge */}
        {duration && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80 font-mono text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(duration)}
          </Badge>
        )}
        
        {/* Play Overlay */}
        <div 
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {snippet.title}
        </h3>
        
        {/* Channel Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={snippet.thumbnails?.default?.url} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {channelInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm text-muted-foreground truncate">
              {snippet.channelTitle}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(viewCount)}</span>
            </div>
            {likeCount !== '0' && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{formatNumber(likeCount)}</span>
              </div>
            )}
            {commentCount !== '0' && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{formatNumber(commentCount)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 px-4">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1" size="sm" aria-label={`Watch video: ${snippet.title}`}>
            <Link to={`/video/${videoId}`}>
              <Play className="w-3 h-3 mr-1" />
              Watch
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            aria-label={`Open ${snippet.title} on YouTube`}
          >
            <a 
              href={`https://youtube.com/watch?v=${videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
