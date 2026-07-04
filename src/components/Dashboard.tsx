import { useState, useEffect } from 'react';
import HomeDashboard from '@/components/HomeDashboard';
import LiveTv from '@/components/LiveTv';
import Movies from '@/components/Movies';
import Series from '@/components/Series';
import Favorites from '@/components/Favorites';
import Recent from '@/components/Recent';
import Settings from '@/components/Settings';
import LoadingOverlay from '@/components/LoadingOverlay';
import { toast } from 'sonner';

interface DashboardProps {
  portalUrl: string;
  macAddress: string;
  username?: string;
  onLogout: () => void;
}

type Section = 'home' | 'live' | 'movies' | 'series' | 'favorites' | 'recent' | 'settings' | 'epg' | 'multi-screen' | 'catchup';

export default function Dashboard({ portalUrl, macAddress, username, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [portalId] = useState(1);

  useEffect(() => {
    // Simulate loading process
    const steps = [
      { progress: 20, message: 'Connecting to portal...' },
      { progress: 40, message: 'Loading channels...' },
      { progress: 60, message: 'Fetching categories...' },
      { progress: 80, message: 'Loading content...' },
      { progress: 100, message: 'Almost ready...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setLoadingProgress(step.progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          toast.success('Connected successfully!');
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [portalUrl]);

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeDashboard onNavigate={(section: string) => setActiveSection(section as Section)} userInfo={{ username, expiration: 'Unlimited' }} />;
      case 'live':
        return <LiveTv portalId={portalId} />;
      case 'movies':
        return <Movies portalId={portalId} />;
      case 'series':
        return <Series portalId={portalId} />;
      case 'favorites':
        return <Favorites portalId={portalId} />;
      case 'recent':
        return <Recent portalId={portalId} />;
      case 'settings':
        return <Settings portalUrl={portalUrl} macAddress={macAddress} username={username} onLogout={onLogout} />;
      case 'epg':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">EPG Guide</h2>
              <p className="text-slate-400">Electronic Program Guide coming soon</p>
            </div>
          </div>
        );
      case 'multi-screen':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Multi-Screen</h2>
              <p className="text-slate-400">Watch multiple channels at once</p>
            </div>
          </div>
        );
      case 'catchup':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Catch Up</h2>
              <p className="text-slate-400">Rewind and watch past programs</p>
            </div>
          </div>
        );
      default:
        return <HomeDashboard onNavigate={(section: string) => setActiveSection(section as Section)} userInfo={{ username, expiration: 'Unlimited' }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950">
      {isLoading && (
        <LoadingOverlay
          message="Loading Content"
          progress={loadingProgress}
        />
      )}

      {renderContent()}
    </div>
  );
}
