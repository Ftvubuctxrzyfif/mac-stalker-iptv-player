import { Tv, Radio, Star, Clock, Settings, Heart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
}

interface Section {
  id: string;
  label: string;
  icon: typeof Tv;
}

const sections: Section[] = [
  { id: 'live', label: 'Live TV', icon: Tv },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange, isCollapsed = false }: SidebarProps) {
  return (
    <div className={cn(
      "bg-slate-900/80 backdrop-blur-xl border-r border-purple-500/20 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-white">Kamel IPTV</h1>
              <p className="text-xs text-slate-400">Android TV</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant="ghost"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full justify-start gap-3 h-12 transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                isCollapsed && "justify-center px-3"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive && "text-purple-400 scale-110",
                !isActive && "group-hover:scale-110"
              )} />
              {!isCollapsed && <span className="font-medium">{section.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Favorites Quick Access */}
      {!isCollapsed && (
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <Heart className="w-4 h-4" />
            <span>Quick Access</span>
          </div>
          <p className="text-xs text-slate-500">Add channels to favorites for quick access</p>
        </div>
      )}
    </div>
  );
}
