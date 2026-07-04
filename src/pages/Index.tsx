import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';

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

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);

  const handleLogin = (playlists: Playlist[]) => {
    setSelectedPlaylists(playlists);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedPlaylists([]);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const activePlaylist = selectedPlaylists.find((p) => p.isActive);

  return (
    <>
      <Dashboard
        portalUrl={activePlaylist?.serverUrl || ''}
        macAddress={activePlaylist?.macAddress || ''}
        username={activePlaylist?.username}
        onLogout={handleLogout}
      />
      <Toaster />
    </>
  );
};

export default Index;
