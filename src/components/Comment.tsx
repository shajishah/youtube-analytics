import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Reply, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentProps {
  comment: any;
  depth?: number;
  maxDepth?: number;
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
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

export default function Comment({ comment, depth = 0, maxDepth = 3 }: CommentProps) {
  const [showReplies, setShowReplies] = useState(depth === 0); // Show replies by default for top-level comments
  const [expandedReplies, setExpandedReplies] = useState(false);
  
  const isReply = comment.isReply || depth > 0;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const canReply = depth < maxDepth;
  
  const commentSnippet = comment.snippet;
  const authorInitial = commentSnippet.authorDisplayName?.charAt(0)?.toUpperCase() || 'U';
  const timeAgo = getTimeAgo(commentSnippet.publishedAt);
  
  const handleReplyClick = () => {
    // In a real app, this would open a reply form
    console.log('Reply to comment:', comment.id);
  };
  
  const handleToggleReplies = () => {
    if (hasReplies) {
      setShowReplies(!showReplies);
    }
  };
  
  const handleExpandReplies = () => {
    setExpandedReplies(!expandedReplies);
  };

  return (
    <div className={cn(
      "w-full",
      isReply && "ml-12"
    )}>
      {/* Main Comment */}
      <div className="flex gap-3 w-full">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={commentSnippet.authorProfileImageUrl} />
          <AvatarFallback className="text-xs">
            {authorInitial}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1 min-w-0">
          {/* Author and timestamp */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate">
              {commentSnippet.authorDisplayName}
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo}
            </p>
            {commentSnippet.authorChannelId && (
              <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20">
                Creator
              </Badge>
            )}
          </div>
          
          {/* Comment text */}
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {commentSnippet.textDisplay}
          </p>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Like button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {commentSnippet.likeCount > 0 && formatNumber(commentSnippet.likeCount)}
            </Button>
            
            {/* Reply button */}
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={handleReplyClick}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
            
            {/* More options */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Replies section */}
      {hasReplies && (
        <div className="mt-2">
          {/* Show/Hide replies toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors ml-11"
            onClick={handleToggleReplies}
          >
            {showReplies ? (
              <ChevronDown className="w-3 h-3 mr-1" />
            ) : (
              <ChevronRight className="w-3 h-3 mr-1" />
            )}
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </Button>
          
          {/* Replies list */}
          {showReplies && (
            <div className="mt-2 space-y-4">
              {comment.replies.slice(0, expandedReplies ? comment.replies.length : 3).map((reply: any) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
              
              {/* Show more replies button */}
              {comment.replies.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors ml-11"
                  onClick={handleExpandReplies}
                >
                  {expandedReplies ? 'Show less' : `Show ${comment.replies.length - 3} more replies`}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
