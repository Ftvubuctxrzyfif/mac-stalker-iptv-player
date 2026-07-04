import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  name: string;
  logo?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlay: () => void;
  isActive?: boolean;
}

export default function ChannelCard({
  name,
  logo,
  isFavorite,
  onToggleFavorite,
  onPlay,
  isActive = false,
}: ChannelCardProps) {
  return (
    <Card
      className={cn(
        "group relative bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer overflow-hidden",
        isActive && "border-purple-500 bg-purple-500/10"
      )}
      onClick={onPlay}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="aspect-video bg-slate-900/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M9.147 19.234a6.28 6.28 0 0 1-5.773-5.462 6.28 6.28 0 0 1 5.108-6.476 6.28 6.28 0 0 1 6.627 4.118 6.28 6.28 0 0 1-4.119 6.626 6.28 6.28 0 0 1-1.843 1.194z"/%3E%3C/svg%3E';
              }}
            />
          ) : (
            <svg className="w-12 h-12 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.147 19.234a6.28 6.28 0 0 1-5.773-5.462 6.28 6.28 0 0 1 5.108-6.476 6.28 6.28 0 0 1 6.627 4.118 6.28 6.28 0 0 1-4.119 6.626 6.28 6.28 0 0 1-1.843 1.194z" />
            </svg>
          )}
        </div>

        {/* Name */}
        <h3 className="font-medium text-white text-sm truncate mb-2">{name}</h3>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isFavorite
                  ? "text-yellow-400 hover:bg-yellow-400/10"
                  : "text-slate-500 hover:text-yellow-400 hover:bg-slate-700/50"
              )}
            >
              <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
          </div>
          <div className="text-xs text-slate-500">Live</div>
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      )}
    </Card>
  );
}
