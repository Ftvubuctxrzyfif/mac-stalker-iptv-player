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
  is_favorite: boolean;
}

interface FavoritesProps {
  portalId: number;
}

// Mock data - replace with real database queries
const mockFavoriteChannels: Channel[] = [
  {
    _row_id: 2,
    name: 'Sky Sports',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    is_favorite: true,
  },
  {
    _row_id: 5,
    name: 'MTV',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    is_favorite: true,
  },
];

export default function Favorites({ portalId: _portalId }: FavoritesProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(mockFavoriteChannels);

  const handleToggleFavorite = async (channelId: number) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch._row_id === channelId ? { ...ch, is_favorite: !ch.is_favorite } : ch
      )
    );
  };

  const handlePlayChannel = (channel: Channel) => {
    setSelectedChannel(channel);
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
        <h2 className="text-2xl font-bold text-white mb-4">Favorite Channels</h2>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : channels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Favorites Yet</h3>
              <p className="text-slate-400 max-w-sm">
                Add channels to your favorites by clicking the star icon on any channel
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
              {channels.map((channel) => (
                <ChannelCard
                  key={channel._row_id}
                  name={channel.name}
                  logo={channel.logo_url}
                  isFavorite={channel.is_favorite}
                  onToggleFavorite={() => handleToggleFavorite(channel._row_id)}
                  onPlay={() => handlePlayChannel(channel)}
                  isActive={selectedChannel?._row_id === channel._row_id}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
