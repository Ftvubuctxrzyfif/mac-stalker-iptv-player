import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Playlist {
  _row_id: number;
  playlist_name: string;
  playlist_url?: string;
  playlist_type: string;
  is_active: boolean;
}

interface PlaylistManagementProps {
  playlists: Playlist[];
  onAddPlaylist: (name: string, url: string) => void;
  onDeletePlaylist: (id: number) => void;
  onSetActive: (id: number) => void;
}

export default function PlaylistManagement({
  playlists,
  onAddPlaylist,
  onDeletePlaylist,
  onSetActive,
}: PlaylistManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    if (!newPlaylistUrl.trim()) {
      toast.error('Please enter a playlist URL');
      return;
    }

    setIsAdding(true);
    
    try {
      onAddPlaylist(newPlaylistName.trim(), newPlaylistUrl.trim());
      setIsAddDialogOpen(false);
      setNewPlaylistName('');
      setNewPlaylistUrl('');
      toast.success('Playlist added successfully');
    } catch (error) {
      toast.error('Failed to add playlist');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Playlists</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Playlist
        </Button>
      </div>

      <div className="space-y-2">
        {playlists.map((playlist) => (
          <Card
            key={playlist._row_id}
            className={`bg-slate-800/50 border transition-all duration-200 ${
              playlist.is_active
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{playlist.playlist_name}</h3>
                  {playlist.playlist_url && (
                    <p className="text-xs text-slate-400 truncate max-w-md">{playlist.playlist_url}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!playlist.is_active && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetActive(playlist._row_id)}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  >
                    Activate
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeletePlaylist(playlist._row_id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {playlists.length === 0 && (
          <Card className="bg-slate-800/30 border-dashed border-2 border-slate-700 p-8 text-center">
            <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Playlists Added</h3>
            <p className="text-sm text-slate-400 mb-4">
              Add M3U playlists from your IPTV provider
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              className="border-purple-500/30 text-purple-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Playlist
            </Button>
          </Card>
        )}
      </div>

      {/* Add Playlist Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Add M3U Playlist</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playlist-name">Playlist Name</Label>
              <Input
                id="playlist-name"
                placeholder="My Live Channels"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playlist-url">M3U Playlist URL</Label>
              <Input
                id="playlist-url"
                type="url"
                placeholder="http://example.com/playlist.m3u"
                value={newPlaylistUrl}
                onChange={(e) => setNewPlaylistUrl(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
              <p className="text-xs text-slate-400">
                Enter the URL to your M3U or M3U8 playlist file
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPlaylist}
              disabled={isAdding}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                'Add Playlist'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
