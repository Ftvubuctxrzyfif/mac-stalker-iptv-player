import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import VideoPlayer from '@/components/VideoPlayer';
import PlaylistSelector from '@/components/PlaylistSelector';

interface Category {
  category_id: string;
  name: string;
}

interface Series {
  _row_id: number;
  name: string;
  logo_url?: string;
  category_id: string;
  cover_url?: string;
  plot?: string;
  year?: number;
  rating?: number;
}

interface Season {
  _row_id: number;
  series_id: number;
  season_number: number;
  name: string;
}

interface Episode {
  _row_id: number;
  season_id: number;
  episode_number: number;
  name: string;
  stream_url: string;
  logo_url?: string;
}

interface SeriesProps {
  portalId: number;
}

// Mock data
const mockCategories: Category[] = [
  { category_id: 'all', name: 'All Series' },
  { category_id: 'drama', name: 'Drama' },
  { category_id: 'action', name: 'Action' },
  { category_id: 'comedy', name: 'Comedy' },
];

const mockSeries: Series[] = [
  {
    _row_id: 201,
    name: 'Game of Thrones',
    logo_url: undefined,
    category_id: 'drama',
    year: 2011,
    rating: 9.2,
  },
  {
    _row_id: 202,
    name: 'Breaking Bad',
    logo_url: undefined,
    category_id: 'drama',
    year: 2008,
    rating: 9.5,
  },
  {
    _row_id: 203,
    name: 'Friends',
    logo_url: undefined,
    category_id: 'comedy',
    year: 1994,
    rating: 8.9,
  },
];

const mockSeasons: Season[] = [
  { _row_id: 1, series_id: 201, season_number: 1, name: 'Season 1' },
  { _row_id: 2, series_id: 201, season_number: 2, name: 'Season 2' },
];

const mockEpisodes: Episode[] = [
  {
    _row_id: 1,
    season_id: 1,
    episode_number: 1,
    name: 'Winter Is Coming',
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  },
  {
    _row_id: 2,
    season_id: 1,
    episode_number: 2,
    name: 'The Kingsroad',
    stream_url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  },
];

export default function Series({ portalId: _portalId }: SeriesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [selectedPlaylist] = useState(1);

  const filteredSeries = mockSeries.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || s.category_id === selectedCategory)
  );

  const seasons = selectedSeries 
    ? mockSeasons.filter((s) => s.series_id === selectedSeries._row_id)
    : [];

  const episodes = selectedSeason
    ? mockEpisodes.filter((e) => e.season_id === selectedSeason._row_id)
    : [];

  const handleSeriesClick = (series: Series) => {
    setSelectedSeries(series);
    setSelectedSeason(null);
    setSelectedEpisode(null);
    setViewMode('detail');
  };

  const handleSeasonClick = (season: Season) => {
    setSelectedSeason(season);
    setSelectedEpisode(null);
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedSeries(null);
    setSelectedSeason(null);
    setSelectedEpisode(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Video Player Section */}
      {selectedEpisode && selectedSeries && (
        <div className="p-6 pb-4">
          <VideoPlayer
            streamUrl={selectedEpisode.stream_url}
            channelName={`${selectedSeries.name} - S${selectedSeason?.season_number || 1} E${selectedEpisode.episode_number}`}
            logo={selectedSeries.logo_url}
          />
        </div>
      )}

      {/* Playlist Selector */}
      <PlaylistSelector
        playlists={[
          { _row_id: 1, playlist_name: 'TV Series', is_active: true },
        ]}
        activePlaylistId={selectedPlaylist}
        onPlaylistChange={() => {}}
      />

      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Categories Sidebar */}
        <ScrollArea className="w-48 border-r border-purple-500/20 pr-4">
          <div className="space-y-1 py-2">
            {mockCategories.map((category) => (
              <Button
                key={category.category_id}
                variant="ghost"
                onClick={() => setSelectedCategory(category.category_id)}
                className="w-full justify-start h-12 transition-all duration-200 text-white hover:bg-slate-800/50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-blue-600/20"
                data-state={selectedCategory === category.category_id ? 'active' : 'inactive'}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'grid' ? (
            <>
              {/* Search */}
              <div className="mb-4 flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search series..."
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

              {/* Series Grid */}
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
                  {filteredSeries.map((series) => (
                    <Card
                      key={series._row_id}
                      className="group cursor-pointer bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 overflow-hidden"
                      onClick={() => handleSeriesClick(series)}
                    >
                      <div className="aspect-[2/3] bg-slate-900/50 relative">
                        {series.logo_url ? (
                          <img
                            src={series.logo_url}
                            alt={series.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <span className="text-2xl font-bold text-purple-400">{series.name[0]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2">{series.name}</h3>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{series.year}</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            {series.rating}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              {/* Series Detail View */}
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={handleBackToGrid}
                  className="text-purple-400 hover:text-purple-300 mb-4"
                >
                  ← Back to Series
                </Button>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedSeries?.name}</h2>
                <p className="text-slate-400">
                  {selectedSeries?.year} • ★ {selectedSeries?.rating}
                </p>
              </div>

              {/* Seasons & Episodes */}
              <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Seasons */}
                <ScrollArea className="col-span-4 border-r border-purple-500/20 pr-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Seasons</h3>
                  <div className="space-y-2">
                    {seasons.map((season) => (
                      <Card
                        key={season._row_id}
                        className={`cursor-pointer transition-all ${
                          selectedSeason?._row_id === season._row_id
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50'
                        }`}
                        onClick={() => handleSeasonClick(season)}
                      >
                        <div className="p-4">
                          <h4 className="font-medium text-white">{season.name}</h4>
                          <p className="text-sm text-slate-400">
                            {mockEpisodes.filter((e) => e.season_id === season._row_id).length} episodes
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Episodes */}
                <ScrollArea className="col-span-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {selectedSeason?.name || 'Select a Season'} - Episodes
                  </h3>
                  <div className="space-y-2">
                    {episodes.map((episode) => (
                      <Card
                        key={episode._row_id}
                        className={`cursor-pointer transition-all ${
                          selectedEpisode?._row_id === episode._row_id
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50'
                        }`}
                        onClick={() => handleEpisodeClick(episode)}
                      >
                        <div className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-400 font-bold">{episode.episode_number}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{episode.name}</h4>
                            <p className="text-sm text-slate-400">
                              Episode {episode.episode_number}
                            </p>
                          </div>
                          <div className="text-purple-400">
                            ▶
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
