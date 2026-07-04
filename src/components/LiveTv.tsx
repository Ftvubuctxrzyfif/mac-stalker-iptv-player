import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChannelCard from '@/components/ChannelCard';
import VideoPlayer from '@/components/VideoPlayer';
import PlaylistSelector from '@/components/PlaylistSelector';

interface Category {
  _row_id: number;
  name: string;
  logo_url?: string;
}

interface Channel {
  _row_id: number;
  name: string;
  logo_url?: string;
  stream_url: string;
  category_id: string;
  is_favorite: boolean;
}

interface LiveTvProps {
  portalId: number;
}

// Mock data - replace with real API calls
const mockCategories: Category[] = [
  { _row_id: 1, name: 'All Channels', logo_url: undefined },
  { _row_id: 2, name: 'Sports', logo_url: undefined },
  { _row_id: 3, name: 'Movies', logo_url: undefined },
  { _row_id: 4, name: 'News', logo_url: undefined },
  { _row_id: 5, name: 'Entertainment', logo_url: undefined },
  { _row_id: 6, name: 'Music', logo_url: undefined },
  { _row_id: 7, name: 'Kids', logo_url: undefined },
  { _row_id: 8, name: 'Documentary', logo_url: undefined },
];

const mockChannels: Channel[] = [
  // Sports channels
  {
    _row_id: 1,
    name: 'ESPN HD',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '2',
    is_favorite: false,
  },
  {
    _row_id: 2,
    name: 'Sky Sports',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '2',
    is_favorite: true,
  },
  {
    _row_id: 3,
    name: 'BT Sport',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '2',
    is_favorite: false,
  },
  // Movies channels
  {
    _row_id: 4,
    name: 'HBO',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '3',
    is_favorite: false,
  },
  {
    _row_id: 5,
    name: 'Cinemax',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '3',
    is_favorite: false,
  },
  // News channels
  {
    _row_id: 6,
    name: 'BBC News',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '4',
    is_favorite: false,
  },
  {
    _row_id: 7,
    name: 'CNN',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '4',
    is_favorite: false,
  },
  {
    _row_id: 8,
    name: 'Al Jazeera',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '4',
    is_favorite: false,
  },
  // Entertainment channels
  {
    _row_id: 9,
    name: 'MTV',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '5',
    is_favorite: true,
  },
  {
    _row_id: 10,
    name: 'Comedy Central',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '5',
    is_favorite: false,
  },
  // Music channels
  {
    _row_id: 11,
    name: 'VH1',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '6',
    is_favorite: false,
  },
  {
    _row_id: 12,
    name: 'MTV Hits',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '6',
    is_favorite: false,
  },
  // Kids channels
  {
    _row_id: 13,
    name: 'Cartoon Network',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '7',
    is_favorite: false,
  },
  {
    _row_id: 14,
    name: 'Nickelodeon',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '7',
    is_favorite: false,
  },
  // Documentary channels
  {
    _row_id: 15,
    name: 'National Geographic',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '8',
    is_favorite: false,
  },
  {
    _row_id: 16,
    name: 'Discovery',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: '8',
    is_favorite: true,
  },
];

export default function LiveTv({ portalId: _portalId }: LiveTvProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [categories] = useState<Category[]>(mockCategories);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 1 || channel.category_id === selectedCategory.toString();
    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = async (channelId: number) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch._row_id === channelId ? { ...ch, is_favorite: !ch.is_favorite } : ch
      )
    );
  };

  const handlePlayChannel = (channel: Channel) => {
    console.log('Playing channel:', channel.name, 'URL:', channel.stream_url);
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

      {/* Playlist Selector */}
      <PlaylistSelector
        playlists={[
          { _row_id: 1, playlist_name: 'Live Channels', is_active: true },
          { _row_id: 2, playlist_name: 'UK Channels', is_active: false },
        ]}
        activePlaylistId={selectedPlaylist}
        onPlaylistChange={setSelectedPlaylist}
      />

      {/* Categories & Channel List */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Categories Sidebar */}
        <ScrollArea className="w-48 border-r border-purple-500/20 pr-4">
          <div className="space-y-1 py-2">
            {categories.map((category) => (
              <Button
                key={category._row_id}
                variant="ghost"
                onClick={() => setSelectedCategory(category._row_id)}
                className={cn(
                  "w-full justify-start h-12 transition-all duration-200",
                  selectedCategory === category._row_id
                    ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Channel Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Category Header */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {categories.find((c) => c._row_id === selectedCategory)?.name || 'All Channels'}
            </h2>
            <span className="text-sm text-slate-400">
              {filteredChannels.length} channels
            </span>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Channels */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                {filteredChannels.map((channel) => (
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
    </div>
  );
}

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
