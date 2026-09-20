import React, { useState } from 'react';
import { PhoneViewport } from './components/PhoneViewport';
import { EmojiStudio } from './components/EmojiStudio';
import { AndroidNativeGuide } from './components/AndroidNativeGuide';
import { PlacedEmoji, PhoneScreenType } from './types';
import { Smartphone, Code, Layers, Sparkles, Pin, Trash2, SmartphoneNfc, Zap, Power } from 'lucide-react';
import { hasNativeOverlay, syncNativeOverlay } from './nativeOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'native_code'>('simulator');
  const [currentPhoneScreen, setCurrentScreen] = useState<PhoneScreenType>('home');
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);

  // Initial placed emojis on phone screen overlay
  const [placedEmojis, setPlacedEmojis] = useState<PlacedEmoji[]>([
    {
      id: 'init-1',
      name: 'Sparkle Heart',
      src: '💖',
      type: 'preset',
      x: 25,
      y: 35,
      size: 56,
      rotation: -10,
      opacity: 1,
      animation: 'float',
      isPinned: true,
      zIndex: 10,
    },
    {
      id: 'init-2',
      name: 'Flame',
      src: '🔥',
      type: 'preset',
      x: 75,
      y: 65,
      size: 60,
      rotation: 12,
      opacity: 0.95,
      animation: 'bounce',
      isPinned: true,
      zIndex: 12,
    },
    {
      id: 'init-3',
      name: 'Cool Cat',
      src: '😎',
      type: 'preset',
      x: 82,
      y: 22,
      size: 48,
      rotation: 5,
      opacity: 1,
      animation: 'pulse',
      isPinned: true,
      zIndex: 14,
    },
  ]);

  const selectedEmoji = placedEmojis.find((e) => e.id === selectedEmojiId) || null;

  React.useEffect(() => {
    if (hasNativeOverlay()) syncNativeOverlay(placedEmojis);
  }, [placedEmojis]);

  const startSystemOverlay = () => {
    if (!window.AndroidOverlay) {
      alert('Open the Android APK to use system-wide floating emojis.');
      return;
    }
    window.AndroidOverlay.requestPermission();
    window.AndroidOverlay.start(JSON.stringify(placedEmojis));
  };

  const stopSystemOverlay = () => {
    window.AndroidOverlay?.stop();
  };

  // Add Emoji Handler
  const handleAddEmoji = (emojiData: Omit<PlacedEmoji, 'id' | 'x' | 'y' | 'zIndex'>) => {
    const newEmoji: PlacedEmoji = {
      ...emojiData,
      id: `emoji-${Date.now()}`,
      x: Math.floor(Math.random() * 40) + 30, // center default (30-70%)
      y: Math.floor(Math.random() * 40) + 30,
      zIndex: placedEmojis.length + 10,
    };

    setPlacedEmojis((prev) => [...prev, newEmoji]);
    setSelectedEmojiId(newEmoji.id);
  };

  // Update Emoji Position (Drag)
  const updateEmojiPosition = (id: string, x: number, y: number) => {
    setPlacedEmojis((prev) =>
      prev.map((e) => (e.id === id ? { ...e, x, y } : e))
    );
  };

  // Update Emoji Styling Properties
  const updateEmojiProps = (id: string, props: Partial<PlacedEmoji>) => {
    setPlacedEmojis((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...props } : e))
    );
  };

  // Remove Single Emoji
  const removeEmoji = (id: string) => {
    setPlacedEmojis((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmojiId === id) setSelectedEmojiId(null);
  };

  // Clear All Emojis
  const clearAllEmojis = () => {
    setPlacedEmojis([]);
    setSelectedEmojiId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <SmartphoneNfc className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">EmojiFloat Studio</h1>
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">System-Wide Floating Custom Emojis for Android</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('native_code')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
              activeTab === 'native_code'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Android Native Code</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startSystemOverlay}
            className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-400 transition"
            title="Start floating emojis over other Android apps"
          >
            <Power className="w-4 h-4" />
            Start Floating
          </button>
          <button
            onClick={stopSystemOverlay}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 hover:text-white hover:border-slate-600 transition"
          >
            Stop
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {activeTab === 'simulator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: EMOJI CREATOR & CONTROLS */}
            <div className="lg:col-span-7 space-y-6">
              <EmojiStudio
                onAddEmoji={handleAddEmoji}
                selectedEmoji={selectedEmoji}
                updateSelectedEmoji={(props) =>
                  selectedEmojiId && updateEmojiProps(selectedEmojiId, props)
                }
              />

              {/* ACTIVE OVERLAY STACK MANAGER */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-sm text-white">
                      Active Floating Emojis ({placedEmojis.length})
                    </h3>
                  </div>
                  {placedEmojis.length > 0 && (
                    <button
                      onClick={clearAllEmojis}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  )}
                </div>

                {placedEmojis.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No floating emojis active. Pick a preset or upload an image above to place one on the phone!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {placedEmojis.map((emoji) => {
                      const isSelected = selectedEmojiId === emoji.id;
                      return (
                        <div
                          key={emoji.id}
                          onClick={() => setSelectedEmojiId(emoji.id)}
                          className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {emoji.type === 'custom_image' ? (
                              <img src={emoji.src} alt={emoji.name} className="w-6 h-6 object-contain shrink-0" />
                            ) : (
                              <span className="text-xl shrink-0">{emoji.src}</span>
                            )}
                            <div className="truncate text-xs">
                              <p className="font-semibold truncate">{emoji.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {emoji.isPinned ? 'Pinned on all screens' : 'Screen specific'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateEmojiProps(emoji.id, { isPinned: !emoji.isPinned });
                              }}
                              className={`p-1 rounded-lg hover:bg-slate-800 ${
                                emoji.isPinned ? 'text-amber-400' : 'text-slate-600'
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeEmoji(emoji.id);
                              }}
                              className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: REALTIME PHONE OVERLAY VIEWPORT */}
            <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
              <PhoneViewport
                currentScreen={currentPhoneScreen}
                setCurrentScreen={setCurrentScreen}
                placedEmojis={placedEmojis}
                selectedEmojiId={selectedEmojiId}
                setSelectedEmojiId={setSelectedEmojiId}
                updateEmojiPosition={updateEmojiPosition}
                updateEmojiProps={updateEmojiProps}
                removeEmoji={removeEmoji}
              />
            </div>
          </div>
        ) : (
          <AndroidNativeGuide />
        )}
      </main>
    </div>
  );
}
