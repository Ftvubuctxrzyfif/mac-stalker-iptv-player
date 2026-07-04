import { useState, useEffect } from 'react';
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

export default function LiveTv({ portalId }: LiveTvProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch real channels and categories from database/playlist
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch from edge function
        const response = await fetch('/api/playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getChannels',
            playlistId: selectedPlaylist,
            portalId: portalId,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.channels) {
            setChannels(data.channels);
          }
        }
        
        // Fetch categories
        const catResponse = await fetch('/api/playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getCategories',
            portalId: portalId,
          }),
        });
        
        if (catResponse.ok) {
          const catData = await catResponse.json();
          if (catData.success && catData.categories) {
            setCategories(catData.categories);
          }
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels. Please add a playlist first.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [portalId, selectedPlaylist]);

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
      {categories.length > 0 && (
        <PlaylistSelector
          playlists={[
            { _row_id: 1, playlist_name: 'Live Channels', is_active: true },
          ]}
          activePlaylistId={selectedPlaylist}
          onPlaylistChange={setSelectedPlaylist}
        />
      )}

      {/* Categories & Channel List */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Categories Sidebar */}
        <ScrollArea className="w-48 border-r border-purple-500/20 pr-4">
          <div className="space-y-1 py-2">
            {categories.length === 0 ? (
              <p className="text-slate-500 text-sm px-3">No categories</p>
            ) : (
              categories.map((category) => (
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
              ))
            )}
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
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <p className="text-sm text-slate-400">Add an M3U playlist in Settings to get started</p>
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-slate-400 mb-2">No channels found</p>
                <p className="text-sm text-slate-500">Try a different category or search term</p>
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
