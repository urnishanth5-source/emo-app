import React, { useState } from 'react';
import { PlacedEmoji, PRESET_EMOJIS, PresetEmoji } from '../types';
import { Upload, Sparkles, Sliders, Layers, Plus, Image as ImageIcon, Video, Film, Grid } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmojiStudioProps {
  onAddEmoji: (emoji: Omit<PlacedEmoji, 'id' | 'x' | 'y' | 'zIndex'>) => void;
  selectedEmoji: PlacedEmoji | null;
  updateSelectedEmoji: (props: Partial<PlacedEmoji>) => void;
}

export const EmojiStudio: React.FC<EmojiStudioProps> = ({
  onAddEmoji,
  selectedEmoji,
  updateSelectedEmoji,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload_img' | 'upload_video' | 'edit'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Image Upload State
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('Custom Sticker');

  // Video Upload State
  const [customVideoSrc, setCustomVideoSrc] = useState<string | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string>('2s Video Sticker');
  const [isCircleCrop, setIsCircleCrop] = useState<boolean>(true);

  // Customizer Controls
  const [size, setSize] = useState<number>(64);
  const [rotation, setRotation] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1.0);
  const [animation, setAnimation] = useState<'none' | 'float' | 'pulse' | 'bounce' | 'spin'>('none');
  const [isPinned, setIsPinned] = useState<boolean>(true);

  // File Upload Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setCustomVideoSrc(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['All', 'Trending', 'Cute & Gaming', 'Reactions', 'Memes', 'Status Icons'];

  const filteredPresets = PRESET_EMOJIS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleAddPreset = (preset: PresetEmoji) => {
    onAddEmoji({
      name: preset.name,
      src: preset.src,
      type: 'preset',
      size: size,
      rotation: rotation,
      opacity: opacity,
      animation: animation,
      isPinned: isPinned,
    });
    confetti({ particleCount: 25, spread: 60, origin: { y: 0.8 } });
  };

  const handleAddCustomImage = () => {
    if (!customImageSrc) return;
    onAddEmoji({
      name: customImageName,
      src: customImageSrc,
      type: 'custom_image',
      size: size,
      rotation: rotation,
      opacity: opacity,
      animation: animation,
      isPinned: isPinned,
    });
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.8 } });
  };

  const handleAddCustomVideo = () => {
    if (!customVideoSrc) return;
    onAddEmoji({
      name: customVideoName,
      src: customVideoSrc,
      type: 'custom_video',
      size: size,
      rotation: rotation,
      opacity: opacity,
      animation: animation,
      isPinned: isPinned,
      isCircleCrop: isCircleCrop,
    });
    confetti({ particleCount: 45, spread: 80, origin: { y: 0.8 } });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-200 shadow-xl space-y-5">
      {/* Studio Header & Tab Switching */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Custom Sticker & Video Creator</h2>
            <p className="text-xs text-slate-400">Pick presets, upload images, or create 2s looping video stickers!</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'presets' ? 'bg-cyan-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Presets
          </button>

          <button
            onClick={() => setActiveTab('upload_img')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'upload_img' ? 'bg-cyan-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image Sticker
          </button>

          <button
            onClick={() => setActiveTab('upload_video')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'upload_video' ? 'bg-cyan-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-pink-400" />
            2s Video Sticker
          </button>

          {selectedEmoji && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'edit' ? 'bg-cyan-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Adjust
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: PRESET EMOJIS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[220px] overflow-y-auto p-1 custom-scrollbar">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleAddPreset(preset)}
                className="group relative p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 flex flex-col items-center justify-center transition active:scale-95 shadow-md"
              >
                <span className="text-3xl group-hover:scale-110 transition">{preset.src}</span>
                <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full">{preset.name}</span>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-cyan-400">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD IMAGE STICKER */}
      {activeTab === 'upload_img' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 bg-slate-950/60 text-center flex flex-col items-center justify-center transition">
            {customImageSrc ? (
              <div className="space-y-3">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500 p-2 bg-slate-900 shadow-xl">
                  <img src={customImageSrc} alt="Uploaded Custom Emoji" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-emerald-400 font-medium">Custom Image Ready!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">Upload Any Photo or PNG Image</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Supports PNG, JPG, GIF or SVG transparent files.
                </p>
              </div>
            )}

            <label className="mt-4 cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition">
              <Upload className="w-4 h-4" />
              <span>{customImageSrc ? 'Choose Different Image' : 'Select Image File'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {customImageSrc && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customImageName}
                onChange={(e) => setCustomImageName(e.target.value)}
                placeholder="Name your sticker..."
                className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddCustomImage}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Pin Image to Phone
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 2-SEC CUSTOM VIDEO STICKER */}
      {activeTab === 'upload_video' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-pink-500/60 rounded-2xl p-6 bg-slate-950/60 text-center flex flex-col items-center justify-center transition">
            {customVideoSrc ? (
              <div className="space-y-3">
                <div
                  className={`w-28 h-28 mx-auto overflow-hidden border-2 border-pink-500 p-1 bg-black shadow-2xl ${
                    isCircleCrop ? 'rounded-full' : 'rounded-2xl'
                  }`}
                >
                  <video src={customVideoSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-pink-400 font-medium">2s Video Sticker Ready!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mx-auto">
                  <Film className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">Upload Short 2-Sec Video / GIF</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Turn short MP4, WebM or MOV clips into continuous floating video stickers!
                </p>
              </div>
            )}

            <label className="mt-4 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition">
              <Video className="w-4 h-4" />
              <span>{customVideoSrc ? 'Choose Different Video' : 'Select Short Video File'}</span>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>
          </div>

          {customVideoSrc && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Sticker Shape Crop:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCircleCrop(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      isCircleCrop
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => setIsCircleCrop(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      !isCircleCrop
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Rounded Box
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customVideoName}
                  onChange={(e) => setCustomVideoName(e.target.value)}
                  placeholder="Name your video sticker..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleAddCustomVideo}
                  className="bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Pin 2s Video to Phone
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GLOBAL SLIDER ADJUSTMENTS FOR SIZE, ROTATION, ANIMATION */}
      <div className="pt-2 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Emoji & Video Overlay Settings
          </span>
          {selectedEmoji && (
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Editing Selected Item
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Size Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Size</span>
              <span className="font-mono text-cyan-400">
                {selectedEmoji ? `${selectedEmoji.size}px` : `${size}px`}
              </span>
            </div>
            <input
              type="range"
              min="32"
              max="140"
              value={selectedEmoji ? selectedEmoji.size : size}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (selectedEmoji) updateSelectedEmoji({ size: val });
                else setSize(val);
              }}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Rotation</span>
              <span className="font-mono text-cyan-400">
                {selectedEmoji ? `${selectedEmoji.rotation}°` : `${rotation}°`}
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedEmoji ? selectedEmoji.rotation : rotation}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (selectedEmoji) updateSelectedEmoji({ rotation: val });
                else setRotation(val);
              }}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Opacity / Transparency</span>
              <span className="font-mono text-cyan-400">
                {selectedEmoji ? `${Math.round(selectedEmoji.opacity * 100)}%` : `${Math.round(opacity * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={selectedEmoji ? selectedEmoji.opacity : opacity}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (selectedEmoji) updateSelectedEmoji({ opacity: val });
                else setOpacity(val);
              }}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Floating Animation Effect Select */}
          <div className="space-y-1.5">
            <label className="text-slate-400 block">Floating Animation Effect</label>
            <select
              value={selectedEmoji ? selectedEmoji.animation : animation}
              onChange={(e) => {
                const val = e.target.value as any;
                if (selectedEmoji) updateSelectedEmoji({ animation: val });
                else setAnimation(val);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-cyan-500"
            >
              <option value="none">Static (No Motion)</option>
              <option value="float">Gentle Float Wave</option>
              <option value="pulse">Pulse Glow</option>
              <option value="bounce">Subtle Bounce</option>
              <option value="spin">Slow Continuous Spin</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
