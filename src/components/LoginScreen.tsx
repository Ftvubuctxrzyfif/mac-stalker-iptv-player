import { useState } from 'react';
import { Tv, Lock, Server, PlayCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Playlist {
  id: string;
  name: string;
  type: 'xtream' | 'm3u' | 'mac';
  serverUrl?: string;
  username?: string;
  password?: string;
  m3uUrl?: string;
  macAddress?: string;
  isActive: boolean;
}

interface LoginScreenProps {
  onLogin: (playlists: Playlist[]) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample saved playlists
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'My Main Provider',
      type: 'xtream',
      serverUrl: 'http://example.com:8080',
      username: 'user123',
      password: '***',
      isActive: true,
    },
  ]);

  // New playlist form
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    type: 'xtream' as 'xtream' | 'm3u' | 'mac',
    serverUrl: '',
    username: '',
    password: '',
    m3uUrl: '',
    macAddress: '',
  });

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleConnect = () => {
    if (!selectedPlaylist) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate connection
    setTimeout(() => {
      // Mark selected as active
      const updatedPlaylists = savedPlaylists.map((p) => ({
        ...p,
        isActive: p.id === selectedPlaylist.id,
      }));
      setSavedPlaylists(updatedPlaylists);
      
      onLogin(updatedPlaylists);
      setIsLoading(false);
    }, 1500);
  };

  const handleAddPlaylist = () => {
    if (!newPlaylist.name.trim()) {
      return;
    }

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylist.name,
      type: newPlaylist.type,
      serverUrl: newPlaylist.serverUrl || undefined,
      username: newPlaylist.username || undefined,
      password: newPlaylist.password || undefined,
      m3uUrl: newPlaylist.m3uUrl || undefined,
      macAddress: newPlaylist.macAddress || undefined,
      isActive: false,
    };

    setSavedPlaylists([...savedPlaylists, playlist]);
    setIsAddDialogOpen(false);
    setNewPlaylist({
      name: '',
      type: 'xtream',
      serverUrl: '',
      username: '',
      password: '',
      m3uUrl: '',
      macAddress: '',
    });
  };

  const handleDeletePlaylist = (id: string) => {
    setSavedPlaylists(savedPlaylists.filter((p) => p.id !== id));
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'xtream':
        return <Server className="w-5 h-5" />;
      case 'm3u':
        return <PlayCircle className="w-5 h-5" />;
      case 'mac':
        return <Tv className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 backdrop-blur-sm mb-6 shadow-2xl shadow-purple-500/30">
            <Tv className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Kamel IPTV
          </h1>
          <p className="text-slate-400 text-lg">Premium IPTV Experience</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlist List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white">Your Playlists</h2>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>

            <div className="space-y-3">
              {savedPlaylists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPlaylist?.id === playlist.id
                      ? 'bg-purple-500/20 border-purple-500 border-2'
                      : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                  }`}
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        playlist.isActive ? 'bg-purple-500/20' : 'bg-slate-700/50'
                      }`}>
                        {getTypeIcon(playlist.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{playlist.name}</h3>
                        <p className="text-xs text-slate-400">
                          {playlist.type === 'xtream' && 'Xtream Codes'}
                          {playlist.type === 'm3u' && 'M3U Playlist'}
                          {playlist.type === 'mac' && 'MAC Address'}
                          {playlist.isActive && ' • Active'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(playlist.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      ×
                    </Button>
                  </div>
                </Card>
              ))}

              {savedPlaylists.length === 0 && (
                <Card className="bg-slate-800/30 border-dashed border-2 border-slate-700 p-8 text-center">
                  <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Playlists Added</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Add your IPTV playlists to get started
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
          </div>

          {/* Connection Info */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <h3 className="font-semibold text-white mb-4">Connection Details</h3>
              
              {selectedPlaylist ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="text-white font-medium">{selectedPlaylist.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Type</p>
                    <p className="text-white font-medium capitalize">{selectedPlaylist.type}</p>
                  </div>
                  {selectedPlaylist.serverUrl && (
                    <div>
                      <p className="text-slate-400">Server</p>
                      <p className="text-white font-medium truncate">{selectedPlaylist.serverUrl}</p>
                    </div>
                  )}
                  {selectedPlaylist.username && (
                    <div>
                      <p className="text-slate-400">Username</p>
                      <p className="text-white font-medium">{selectedPlaylist.username}</p>
                    </div>
                  )}
                  {selectedPlaylist.m3uUrl && (
                    <div>
                      <p className="text-slate-400">Playlist URL</p>
                      <p className="text-white font-medium truncate">{selectedPlaylist.m3uUrl}</p>
                    </div>
                  )}
                  {selectedPlaylist.macAddress && (
                    <div>
                      <p className="text-slate-400">MAC Address</p>
                      <p className="text-white font-medium font-mono">{selectedPlaylist.macAddress}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Select a playlist to view details</p>
              )}
            </Card>

            <Button
              onClick={handleConnect}
              disabled={!selectedPlaylist || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>Connect to Selected</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Add Playlist Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Playlist</DialogTitle>
            </DialogHeader>
            
            <Tabs value={newPlaylist.type} onValueChange={(v) => setNewPlaylist({ ...newPlaylist, type: v as any })}>
              <TabsList className="grid grid-cols-3 bg-slate-800">
                <TabsTrigger value="xtream">Xtream</TabsTrigger>
                <TabsTrigger value="m3u">M3U</TabsTrigger>
                <TabsTrigger value="mac">MAC</TabsTrigger>
              </TabsList>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Playlist Name</Label>
                  <Input
                    placeholder="My Provider"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                {newPlaylist.type === 'xtream' && (
                  <>
                    <div className="space-y-2">
                      <Label>Server URL</Label>
                      <Input
                        placeholder="http://example.com:8080"
                        value={newPlaylist.serverUrl}
                        onChange={(e) => setNewPlaylist({ ...newPlaylist, serverUrl: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        placeholder="Your username"
                        value={newPlaylist.username}
                        onChange={(e) => setNewPlaylist({ ...newPlaylist, username: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Your password"
                        value={newPlaylist.password}
                        onChange={(e) => setNewPlaylist({ ...newPlaylist, password: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </>
                )}

                {newPlaylist.type === 'm3u' && (
                  <div className="space-y-2">
                    <Label>M3U Playlist URL</Label>
                    <Input
                      placeholder="http://example.com/playlist.m3u"
                      value={newPlaylist.m3uUrl}
                      onChange={(e) => setNewPlaylist({ ...newPlaylist, m3uUrl: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                )}

                {newPlaylist.type === 'mac' && (
                  <>
                    <div className="space-y-2">
                      <Label>Portal URL</Label>
                      <Input
                        placeholder="http://portal.example.com"
                        value={newPlaylist.serverUrl}
                        onChange={(e) => setNewPlaylist({ ...newPlaylist, serverUrl: e.target.value })}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>MAC Address</Label>
                      <Input
                        placeholder="XX:XX:XX:XX:XX:XX"
                        value={newPlaylist.macAddress}
                        onChange={(e) => setNewPlaylist({ ...newPlaylist, macAddress: e.target.value.toUpperCase() })}
                        maxLength={17}
                        className="bg-slate-800 border-slate-700 font-mono"
                      />
                    </div>
                  </>
                )}
              </div>
            </Tabs>

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
                disabled={!newPlaylist.name}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Add Playlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
