import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Users, PlaySquare, Eye } from "lucide-react";

export default function ChannelCard({ channel }) {
  if (!channel) return null;

  const { snippet, statistics } = channel;
  const { title, description, thumbnails, customUrl, publishedAt } = snippet;

  return (
    <Card className="max-w-lg mx-auto shadow-lg rounded-2xl border bg-white hover:shadow-xl transition">
      <CardHeader className="flex flex-col items-center space-y-2">
        <img
          src={thumbnails?.high?.url}
          alt={title}
          className="w-32 h-32 rounded-full object-cover shadow"
        />
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <p className="text-sm text-gray-500">@{customUrl}</p>
        <p className="text-xs text-gray-400">
          Since {new Date(publishedAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Users className="mx-auto h-5 w-5 text-blue-500" />
            <p className="font-semibold">
              {Number(statistics.subscriberCount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Subscribers</p>
          </div>
          <div>
            <Eye className="mx-auto h-5 w-5 text-green-500" />
            <p className="font-semibold">
              {Number(statistics.viewCount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div>
            <PlaySquare className="mx-auto h-5 w-5 text-red-500" />
            <p className="font-semibold">
              {Number(statistics.videoCount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Videos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
