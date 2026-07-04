import { ChevronDown, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Playlist {
  _row_id: number;
  playlist_name: string;
  is_active: boolean;
}

interface PlaylistSelectorProps {
  playlists: Playlist[];
  activePlaylistId: number;
  onPlaylistChange: (id: number) => void;
}

export default function PlaylistSelector({
  playlists,
  activePlaylistId,
  onPlaylistChange,
}: PlaylistSelectorProps) {
  const activePlaylist = playlists.find((p) => p._row_id === activePlaylistId);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-purple-500/20 bg-slate-900/50">
      <Tv className="w-4 h-4 text-purple-400" />
      
      {playlists.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-between h-auto py-2 px-3 text-white hover:bg-slate-800/50"
            >
              <span className="font-medium">{activePlaylist?.playlist_name || 'Select Playlist'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-purple-500/20">
            <ScrollArea className="max-h-96">
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist._row_id}
                  onClick={() => onPlaylistChange(playlist._row_id)}
                  className={`text-white focus:bg-purple-500/20 cursor-pointer ${
                    playlist._row_id === activePlaylistId
                      ? 'bg-purple-500/20 text-purple-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex-1">{playlist.playlist_name}</span>
                    {playlist.is_active && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span className="font-medium text-white">{activePlaylist?.playlist_name}</span>
      )}
    </div>
  );
}
