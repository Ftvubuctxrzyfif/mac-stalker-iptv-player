import { useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChannelCard from '@/components/ChannelCard';
import VideoPlayer from '@/components/VideoPlayer';
import PlaylistSelector from '@/components/PlaylistSelector';

interface Category {
  category_id: string;
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

interface MoviesProps {
  portalId: number;
}

// Mock data - replace with real API calls
const mockCategories: Category[] = [
  { category_id: 'all', name: 'All Movies', logo_url: undefined },
  { category_id: 'action', name: 'Action', logo_url: undefined },
  { category_id: 'comedy', name: 'Comedy', logo_url: undefined },
  { category_id: 'drama', name: 'Drama', logo_url: undefined },
  { category_id: 'horror', name: 'Horror', logo_url: undefined },
  { category_id: 'scifi', name: 'Sci-Fi', logo_url: undefined },
];

const mockMovies: Channel[] = [
  {
    _row_id: 101,
    name: 'The Dark Knight',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: 'action',
    is_favorite: false,
  },
  {
    _row_id: 102,
    name: 'Inception',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: 'scifi',
    is_favorite: true,
  },
  {
    _row_id: 103,
    name: 'The Hangover',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: 'comedy',
    is_favorite: false,
  },
  {
    _row_id: 104,
    name: 'The Conjuring',
    logo_url: undefined,
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category_id: 'horror',
    is_favorite: false,
  },
];

export default function Movies({ portalId: _portalId }: MoviesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);
  const [movies, setMovies] = useState<Channel[]>(mockMovies);
  const [categories] = useState<Category[]>(mockCategories);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || movie.category_id === selectedCategory)
  );

  const handleToggleFavorite = async (movieId: number) => {
    setMovies((prev) =>
      prev.map((m) =>
        m._row_id === movieId ? { ...m, is_favorite: !m.is_favorite } : m
      )
    );
  };

  const handlePlayMovie = (movie: Channel) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Video Player Section */}
      {selectedMovie && (
        <div className="p-6 pb-4">
          <VideoPlayer
            streamUrl={selectedMovie.stream_url}
            channelName={selectedMovie.name}
            logo={selectedMovie.logo_url}
          />
        </div>
      )}

      {/* Playlist Selector */}
      <PlaylistSelector
        playlists={[
          { _row_id: 1, playlist_name: 'VOD Movies', is_active: true },
          { _row_id: 2, playlist_name: '4K Movies', is_active: false },
        ]}
        activePlaylistId={selectedPlaylist}
        onPlaylistChange={setSelectedPlaylist}
      />

      {/* Categories & Movie List */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Categories Sidebar */}
        <ScrollArea className="w-48 border-r border-purple-500/20 pr-4">
          <div className="space-y-1 py-2">
            {categories.map((category) => (
              <Button
                key={category.category_id}
                variant="ghost"
                onClick={() => setSelectedCategory(category.category_id)}
                className="w-full justify-start h-12 transition-all duration-200 text-white hover:bg-slate-800/50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:border data-[state=active]:border-purple-500/30"
                data-state={selectedCategory === category.category_id ? 'active' : 'inactive'}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Movie Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="mb-4 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>
            <Button variant="outline" className="border-purple-500/30 text-purple-400">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Movies */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                {filteredMovies.map((movie) => (
                  <ChannelCard
                    key={movie._row_id}
                    name={movie.name}
                    logo={movie.logo_url}
                    isFavorite={movie.is_favorite}
                    onToggleFavorite={() => handleToggleFavorite(movie._row_id)}
                    onPlay={() => handlePlayMovie(movie)}
                    isActive={selectedMovie?._row_id === movie._row_id}
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
