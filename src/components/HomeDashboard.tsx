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
      subtitle: 'Watch Live Channels',
      icon: Tv,
      gradient: 'from-teal-500/20 via-emerald-500/20 to-cyan-500/20',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-400',
      size: 'lg',
      glow: 'shadow-teal-500/20',
    },
    {
      id: 'movies',
      title: 'MOVIES',
      subtitle: 'On-Demand Movies',
      icon: Film,
      gradient: 'from-orange-500/20 via-pink-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      size: 'md',
      glow: 'shadow-orange-500/20',
    },
    {
      id: 'series',
      title: 'SERIES',
      subtitle: 'TV Shows & Series',
      icon: Clapperboard,
      gradient: 'from-purple-500/20 via-blue-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      size: 'md',
      glow: 'shadow-purple-500/20',
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
            <h1 className="text-xl font-bold text-white">KAMEL IPTV</h1>
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
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${card.glow} bg-gradient-to-br ${card.gradient} border ${card.borderColor} backdrop-blur-xl group`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-8 h-full flex flex-col items-center justify-center">
                  <div className={`relative mb-6`}>
                    <Icon className={`w-20 h-20 ${card.textColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`} />
                    <div className={`absolute inset-0 blur-xl ${card.textColor} opacity-30 group-hover:opacity-50 transition-opacity`} />
                  </div>
                  <h2 className={`text-3xl font-bold ${card.textColor} mb-2`}>{card.title}</h2>
                  <p className="text-slate-400 text-sm mb-4">{card.subtitle}</p>
                  {card.size === 'lg' && (
                    <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tv className="w-10 h-10 text-teal-400" />
                    </div>
                  )}
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {secondaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${card.bgColor} border ${card.borderColor} backdrop-blur-xl group`}
                onClick={() => onNavigate(card.id)}
              >
                <div className="p-6 flex items-center justify-center gap-4">
                  <Icon className={`w-8 h-8 ${card.color} transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12`} />
                  <span className={`text-base font-semibold ${card.color}`}>{card.title}</span>
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
