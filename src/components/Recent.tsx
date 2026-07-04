import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChannelCard from '@/components/ChannelCard';
import VideoPlayer from '@/components/VideoPlayer';

interface Channel {
  _row_id: number;
  name: string;
  logo_url?: string;
  stream_url: string;
  watched_at: number;
}

interface RecentProps {
  portalId: number;
}

// Mock data - replace with real database queries
const mockRecentChannels: Channel[] = [
  {
    _row_id: 1,
    name: 'ESPN HD',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    watched_at: Date.now() - 1000 * 60 * 5, // 5 minutes ago
  },
  {
    _row_id: 3,
    name: 'BBC News',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    watched_at: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
  {
    _row_id: 4,
    name: 'HBO',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    watched_at: Date.now() - 1000 * 60 * 60, // 1 hour ago
  },
];

export default function Recent({ portalId: _portalId }: RecentProps) {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isLoading] = useState(false);
  const [channels] = useState<Channel[]>(mockRecentChannels);

  const handlePlayChannel = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Video Player Section */}
      {selectedChannel && (
        <div className="p-6 pb-4">
          <VideoPlayer
            streamUrl={selectedChannel.stream_url}
            channelName={selectedChannel.name}
            logo={selectedChannel.logo_url}
          />
        </div>
      )}

      {/* Channel Grid */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Recently Watched</h2>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : channels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Recent Channels</h3>
              <p className="text-slate-400 max-w-sm">
                Start watching channels and they'll appear here for quick access
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
              {channels.map((channel) => (
                <div key={channel._row_id} className="relative">
                  <ChannelCard
                    name={channel.name}
                    logo={channel.logo_url}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                    onPlay={() => handlePlayChannel(channel)}
                    isActive={selectedChannel?._row_id === channel._row_id}
                  />
                  <div className="absolute top-6 right-6 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {formatTimeAgo(channel.watched_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
