import { useState } from 'react';
import { Tv, Film, Clapperboard, Calendar, Layers, Clock, ShoppingCart, Bell, User, Settings as SettingsIcon, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HomeDashboardProps {
  onNavigate: (section: string) => void;
  userInfo?: {
    username?: string;
    expiration?: string;
  };
}

export default function HomeDashboard({ onNavigate, userInfo }: HomeDashboardProps) {
  const [currentTime] = useState(new Date());

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const mainCards = [
    {
      id: 'live',
      title: 'LIVE TV',
      icon: Tv,
      gradient: 'from-teal-500/20 via-emerald-500/20 to-cyan-500/20',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-400',
      size: 'lg'
    },
    {
      id: 'movies',
      title: 'MOVIES',
      icon: Film,
      gradient: 'from-orange-500/20 via-pink-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      size: 'md'
    },
    {
      id: 'series',
      title: 'SERIES',
      icon: Clapperboard,
      gradient: 'from-purple-500/20 via-blue-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      size: 'md'
    }
  ];

  const secondaryCards = [
    {
      id: 'epg',
      title: 'INSTALL EPG',
      icon: Calendar,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'multi-screen',
      title: 'MULTI-SCREEN',
      icon: Layers,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'catchup',
      title: 'CATCH UP',
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-blue-950">
      {/* Top Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">IPTV PLAYER</h1>
          </div>

          {/* Time */}
          <div className="text-center">
            <p className="text-white font-medium">{formatDateTime(currentTime)}</p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => onNavigate('settings')}>
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Main Cards - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {mainCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${card.gradient} border ${card.borderColor} backdrop-blur-xl`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-8 h-full flex flex-col items-center justify-center">
                  <Icon className={`w-16 h-16 ${card.textColor} mb-6`} />
                  <h2 className={`text-3xl font-bold ${card.textColor} mb-2`}>{card.title}</h2>
                  {card.size === 'lg' && (
                    <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                      <Tv className="w-8 h-8 text-teal-400" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {secondaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${card.bgColor} border ${card.borderColor} backdrop-blur-xl`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-4 flex items-center justify-center gap-3">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                  <span className={`text-sm font-semibold ${card.color}`}>{card.title}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="text-slate-400">
            <span className="font-medium">Expiration: </span>
            <span className="text-white">{userInfo?.expiration || 'Unlimited'}</span>
          </div>
          
          <Card className="bg-purple-500/10 border border-purple-500/20 cursor-pointer hover:bg-purple-500/20 transition-all">
            <div className="p-3 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Purchase Ads Free Version</span>
            </div>
          </Card>
          
          <div className="text-slate-400">
            <span className="font-medium">Logged in: </span>
            <span className="text-white">{userInfo?.username || 'Guest'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
