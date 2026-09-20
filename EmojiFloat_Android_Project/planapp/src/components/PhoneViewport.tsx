import React, { useRef } from 'react';
import { PlacedEmoji, PhoneScreenType } from '../types';
import { MessageSquare, Heart, Camera, Settings as SettingsIcon, Home, Pin, Lock, Trash2, RotateCw, Sparkles, Send, Bell, Film } from 'lucide-react';

interface PhoneViewportProps {
  currentScreen: PhoneScreenType;
  setCurrentScreen: (screen: PhoneScreenType) => void;
  placedEmojis: PlacedEmoji[];
  selectedEmojiId: string | null;
  setSelectedEmojiId: (id: string | null) => void;
  updateEmojiPosition: (id: string, x: number, y: number) => void;
  updateEmojiProps: (id: string, props: Partial<PlacedEmoji>) => void;
  removeEmoji: (id: string) => void;
}

export const PhoneViewport: React.FC<PhoneViewportProps> = ({
  currentScreen,
  setCurrentScreen,
  placedEmojis,
  selectedEmojiId,
  setSelectedEmojiId,
  updateEmojiPosition,
  updateEmojiProps,
  removeEmoji,
}) => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const draggingIdRef = useRef<string | null>(null);

  // Filter emojis to show on phone (either pinned across all screens, or added to current screen)
  const visibleEmojis = placedEmojis.filter((e) => e.isPinned || true);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmojiId(id);
    draggingIdRef.current = id;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!phoneRef.current || !draggingIdRef.current) return;
      const rect = phoneRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((moveEvent.clientY - rect.top) / rect.height) * 100));
      updateEmojiPosition(draggingIdRef.current, xPercent, yPercent);
    };

    const onMouseUp = () => {
      draggingIdRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    e.stopPropagation();
    setSelectedEmojiId(id);
    const touch = e.touches[0];
    if (!touch || !phoneRef.current) return;
    draggingIdRef.current = id;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!phoneRef.current || !draggingIdRef.current) return;
      const moveTouch = moveEvent.touches[0];
      if (!moveTouch) return;
      const rect = phoneRef.current.getBoundingClientRect();
      const xPercent = Math.max(0, Math.min(100, ((moveTouch.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((moveTouch.clientY - rect.top) / rect.height) * 100));
      updateEmojiPosition(draggingIdRef.current, xPercent, yPercent);
    };

    const onTouchEnd = () => {
      draggingIdRef.current = null;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Phone Outer Shell */}
      <div className="relative w-[340px] sm:w-[380px] h-[680px] bg-slate-950 rounded-[48px] p-3 shadow-2xl shadow-cyan-950/40 border-[4px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Container */}
        <div
          ref={phoneRef}
          onClick={() => setSelectedEmojiId(null)}
          className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-900 flex flex-col select-none"
        >
          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1 flex justify-between items-center text-[10px] font-mono font-medium text-slate-300 z-30">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* SIMULATED APP CONTENT */}
          <div className="relative flex-1 overflow-hidden">
            {/* 1. HOME SCREEN */}
            {currentScreen === 'home' && (
              <div className="h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-4 flex flex-col justify-between">
                {/* Date & Time Widget */}
                <div className="mt-8 text-center space-y-1">
                  <p className="text-4xl font-extrabold text-white tracking-tight">09:41</p>
                  <p className="text-xs text-cyan-300 font-medium">Saturday, September 19</p>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-4 px-2 my-auto">
                  <button onClick={() => setCurrentScreen('chat')} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-300">Messages</span>
                  </button>

                  <button onClick={() => setCurrentScreen('social')} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition">
                      <Heart className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-300">Social</span>
                  </button>

                  <button onClick={() => setCurrentScreen('camera')} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-300">Camera</span>
                  </button>

                  <button onClick={() => setCurrentScreen('settings')} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-active:scale-95 transition">
                      <SettingsIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-slate-300">Settings</span>
                  </button>
                </div>

                {/* Bottom Dock */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2.5 flex justify-around border border-white/10 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xs">📞</div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xs">💬</div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white text-xs">🌐</div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white text-xs">🎵</div>
                </div>
              </div>
            )}

            {/* 2. CHAT APP SCREEN */}
            {currentScreen === 'chat' && (
              <div className="h-full bg-slate-900 flex flex-col">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Alex Rivera</p>
                      <p className="text-[9px] text-emerald-400">Online now</p>
                    </div>
                  </div>
                  <Bell className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-2xl rounded-tl-xs max-w-[80%] text-slate-200">
                    Hey! Look at the custom floating emojis on my phone screen! 🚀
                  </div>
                  <div className="bg-cyan-600 p-2.5 rounded-2xl rounded-tr-xs max-w-[80%] ml-auto text-white">
                    That looks awesome! How did you get them to float over all apps?
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-2xl rounded-tl-xs max-w-[80%] text-slate-200">
                    With the Android Overlay service! They stay right where I place them! ✨
                  </div>
                </div>

                <div className="p-2 border-t border-slate-800 flex items-center gap-2 bg-slate-950">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-900 text-xs px-3 py-2 rounded-full border border-slate-700 text-white placeholder-slate-500 outline-none"
                    readOnly
                  />
                  <div className="w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. SOCIAL APP SCREEN */}
            {currentScreen === 'social' && (
              <div className="h-full bg-black text-white p-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-bold text-sm tracking-wide">SocialFeed</span>
                    <Sparkles className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-pink-900/40" />
                    <p className="relative z-10 text-xs text-zinc-300 font-medium">
                      Simulated Instagram Feed Photo.
                      <br />
                      <span className="text-[10px] text-zinc-500">Emojis & 2s Video Stickers stay pinned on top!</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-around text-zinc-400 border-t border-zinc-800 pt-2">
                  <Home className="w-5 h-5 text-pink-500" />
                  <Heart className="w-5 h-5" />
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            )}

            {/* 4. CAMERA SCREEN */}
            {currentScreen === 'camera' && (
              <div className="h-full bg-zinc-950 flex flex-col justify-between p-4 relative">
                <div className="flex justify-between items-center text-zinc-400 text-xs">
                  <span>FLASH OFF</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-mono">LIVE</span>
                </div>

                <div className="border border-dashed border-zinc-700/60 rounded-2xl flex-1 my-3 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-500/50 animate-spin-slow flex items-center justify-center">
                    <Camera className="w-5 h-5 text-zinc-500" />
                  </div>
                </div>

                <div className="flex items-center justify-around">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                  <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white" />
                  </div>
                  <RotateCw className="w-6 h-6 text-zinc-400" />
                </div>
              </div>
            )}

            {/* 5. SETTINGS SCREEN */}
            {currentScreen === 'settings' && (
              <div className="h-full bg-slate-950 text-white p-4 space-y-4">
                <h3 className="font-bold text-sm">System Settings</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between border border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Display Over Other Apps</p>
                      <p className="text-[10px] text-emerald-400">Granted • System Alert Window</p>
                    </div>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full p-0.5 flex justify-end">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between border border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Video Sticker Loop Speed</p>
                      <p className="text-[10px] text-slate-400">Continuous 2s video loop enabled</p>
                    </div>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full p-0.5 flex justify-end">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLACED FLOATING EMOJIS & VIDEO STICKERS OVERLAY LAYER */}
            {visibleEmojis.map((emoji) => {
              const isSelected = selectedEmojiId === emoji.id;
              const animClass =
                emoji.animation === 'float'
                  ? 'animate-float-gentle'
                  : emoji.animation === 'pulse'
                  ? 'animate-pulse-glow'
                  : emoji.animation === 'bounce'
                  ? 'animate-bounce-subtle'
                  : emoji.animation === 'spin'
                  ? 'animate-spin-slow'
                  : '';

              return (
                <div
                  key={emoji.id}
                  onMouseDown={(e) => handleMouseDown(emoji.id, e)}
                  onTouchStart={(e) => handleTouchStart(emoji.id, e)}
                  style={{
                    left: `${emoji.x}%`,
                    top: `${emoji.y}%`,
                    transform: `translate(-50%, -50%) rotate(${emoji.rotation}deg)`,
                    opacity: emoji.opacity,
                    zIndex: isSelected ? 40 : emoji.zIndex,
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
                    isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black rounded-lg p-1' : ''
                  }`}
                >
                  <div className={`relative ${animClass}`}>
                    {emoji.type === 'custom_video' ? (
                      <div
                        style={{ width: `${emoji.size}px`, height: `${emoji.size}px` }}
                        className={`relative overflow-hidden shadow-2xl ${
                          emoji.isCircleCrop ? 'rounded-full border-2 border-cyan-400' : 'rounded-2xl'
                        }`}
                      >
                        <video
                          src={emoji.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded text-[8px] text-cyan-300 font-mono font-bold flex items-center gap-0.5">
                          <Film className="w-2.5 h-2.5" /> 2s
                        </div>
                      </div>
                    ) : emoji.type === 'custom_image' ? (
                      <img
                        src={emoji.src}
                        alt={emoji.name}
                        style={{ width: `${emoji.size}px`, height: `${emoji.size}px` }}
                        className="object-contain pointer-events-none drop-shadow-xl"
                      />
                    ) : (
                      <span
                        style={{ fontSize: `${emoji.size}px`, leading: 1 }}
                        className="select-none inline-block drop-shadow-md"
                      >
                        {emoji.src}
                      </span>
                    )}
                  </div>

                  {/* QUICK ACTIONS TOOLBAR ON SELECTED EMOJI */}
                  {isSelected && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-700 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 shadow-xl text-white z-50 whitespace-nowrap"
                    >
                      <button
                        onClick={() => updateEmojiProps(emoji.id, { isPinned: !emoji.isPinned })}
                        title={emoji.isPinned ? 'Unpin from all screens' : 'Pin to all screens'}
                        className={`p-1 rounded-full hover:bg-slate-800 ${
                          emoji.isPinned ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeEmoji(emoji.id)}
                        title="Delete Sticker"
                        className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SIMULATED APP NAVIGATION BAR */}
          <div className="bg-slate-950 p-2.5 flex justify-around border-t border-slate-800/60 z-30">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`p-1.5 rounded-xl flex items-center gap-1 transition ${
                currentScreen === 'home' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('chat')}
              className={`p-1.5 rounded-xl flex items-center gap-1 transition ${
                currentScreen === 'chat' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('social')}
              className={`p-1.5 rounded-xl flex items-center gap-1 transition ${
                currentScreen === 'social' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('camera')}
              className={`p-1.5 rounded-xl flex items-center gap-1 transition ${
                currentScreen === 'camera' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 font-mono flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Click or drag any emoji or 2s video sticker on screen
      </p>
    </div>
  );
};
