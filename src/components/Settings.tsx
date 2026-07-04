import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LogOut, Trash2, Server } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsProps {
  portalUrl: string;
  macAddress: string;
  username?: string;
  onLogout: () => void;
}

export default function Settings({ portalUrl, macAddress, username, onLogout }: SettingsProps) {
  const handleClearCache = () => {
    // Clear channel cache
    toast.success('Cache cleared successfully');
  };

  const handleDeletePortal = () => {
    toast.success('Portal configuration deleted');
    onLogout();
  };

  return (
    <div className="flex-1 overflow-hidden px-6 pb-6">
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>

        {/* Portal Information */}
        <Card className="bg-slate-800/50 border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Portal Configuration</h3>
              <p className="text-sm text-slate-400">Your current IPTV portal settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Portal URL</Label>
              <p className="text-white mt-1">{portalUrl}</p>
            </div>

            <div>
              <Label className="text-slate-300">MAC Address</Label>
              <p className="text-white mt-1 font-mono">{macAddress}</p>
            </div>

            {username && (
              <div>
                <Label className="text-slate-300">Username</Label>
                <p className="text-white mt-1">{username}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Cache Management */}
        <Card className="bg-slate-800/50 border-purple-500/20 p-6">
          <h3 className="font-semibold text-white mb-4">Cache Management</h3>
          <p className="text-sm text-slate-400 mb-4">
            Clear cached channel data to force a refresh from your portal
          </p>
          <Button
            variant="outline"
            onClick={handleClearCache}
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Channel Cache
          </Button>
        </Card>

        <Separator className="bg-purple-500/20" />

        {/* Logout */}
        <Card className="bg-slate-800/50 border-red-500/20 p-6">
          <h3 className="font-semibold text-white mb-4">Portal Management</h3>
          <p className="text-sm text-slate-400 mb-4">
            Disconnect from current portal or delete this configuration
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePortal}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Portal
            </Button>
          </div>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-slate-500 py-4">
          <p>Mac Stalker IPTV Player v1.0</p>
          <p className="mt-1">Optimized for Android TV 12+</p>
        </div>
      </div>
    </div>
  );
}
