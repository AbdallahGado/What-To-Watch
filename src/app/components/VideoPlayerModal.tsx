import React from 'react';
import { X, Maximize, Volume2, SkipForward, Play, Pause } from 'lucide-react';

interface VideoPlayerModalProps {
  title: string;
  onClose: () => void;
}

export const VideoPlayerModal = ({ title, onClose }: VideoPlayerModalProps) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  // Simulate progress
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Video Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black group">
        {/* Placeholder for actual video content */}
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="z-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-widest uppercase">Now Playing</h2>
            <p className="text-xl text-brand-400">{title}</p>
        </div>

        {/* Controls Overlay (appears on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg">{title}</h3>
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Bar */}
            <div className="space-y-4">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div 
                        className="h-full bg-brand-500 relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:text-brand-400 transition-colors"
                        >
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                        </button>
                        <button className="text-white hover:text-brand-400 transition-colors">
                            <SkipForward className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2 text-white/80 group/vol">
                            <Volume2 className="w-6 h-6" />
                            <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300">
                                <div className="h-1 bg-white/50 w-20 rounded-full ml-2" />
                            </div>
                        </div>
                    </div>
                    
                    <button className="text-white hover:text-brand-400 transition-colors">
                        <Maximize className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
