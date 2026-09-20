export interface PlacedEmoji {
  id: string;
  name: string;
  src: string; // URL, blob URL, or emoji character/SVG
  type: 'emoji' | 'custom_image' | 'custom_video' | 'preset';
  x: number; // percentage of phone width (0-100)
  y: number; // percentage of phone height (0-100)
  size: number; // in pixels (e.g. 24 to 160)
  rotation: number; // degrees (-180 to 180)
  opacity: number; // 0.1 to 1.0
  animation: 'none' | 'float' | 'pulse' | 'bounce' | 'spin';
  isPinned: boolean; // stays across phone screens
  glowColor?: string;
  zIndex: number;
  isCircleCrop?: boolean;
}

export interface PresetEmoji {
  id: string;
  name: string;
  src: string;
  category: 'Trending' | 'Cute & Gaming' | 'Reactions' | 'Memes' | 'Status Icons';
  tags: string[];
}

export const PRESET_EMOJIS: PresetEmoji[] = [
  { id: 'p1', name: 'Cool Cat', src: '😎', category: 'Trending', tags: ['cool', 'sunglasses', 'cat'] },
  { id: 'p2', name: 'Sparkle Heart', src: '💖', category: 'Trending', tags: ['love', 'pink', 'sparkle'] },
  { id: 'p3', name: 'Fire Blast', src: '🔥', category: 'Trending', tags: ['lit', 'hot', 'fire'] },
  { id: 'p4', name: 'Cyber Skull', src: '💀', category: 'Reactions', tags: ['dead', 'lol', 'skull'] },
  { id: 'p5', name: 'Alien UFO', src: '🛸', category: 'Cute & Gaming', tags: ['space', 'alien', 'gaming'] },
  { id: 'p6', name: 'Gaming Controller', src: '🎮', category: 'Cute & Gaming', tags: ['game', 'play', 'console'] },
  { id: 'p7', name: 'Crown King', src: '👑', category: 'Status Icons', tags: ['king', 'royal', 'gold'] },
  { id: 'p8', name: 'Ghost Buddy', src: '👻', category: 'Cute & Gaming', tags: ['spooky', 'cute', 'ghost'] },
  { id: 'p9', name: 'Party Popper', src: '🎉', category: 'Reactions', tags: ['party', 'celebrate', 'tada'] },
  { id: 'p10', name: 'Star Eyes', src: '🤩', category: 'Trending', tags: ['star', 'wow', 'excited'] },
  { id: 'p11', name: 'Rainbow', src: '🌈', category: 'Cute & Gaming', tags: ['rainbow', 'color', 'sky'] },
  { id: 'p12', name: 'Cute Doggo', src: '🐶', category: 'Cute & Gaming', tags: ['dog', 'pet', 'puppy'] },
  { id: 'p13', name: 'Battery Low', src: '🪫', category: 'Status Icons', tags: ['tech', 'battery', 'charge'] },
  { id: 'p14', name: 'Warning Sign', src: '⚠️', category: 'Status Icons', tags: ['alert', 'warning', 'icon'] },
  { id: 'p15', name: 'Nerd Glasses', src: '🤓', category: 'Reactions', tags: ['smart', 'nerd', 'geek'] },
  { id: 'p16', name: 'Cute Boba', src: '🧋', category: 'Memes', tags: ['boba', 'drink', 'sweet'] },
  { id: 'p17', name: 'Pepe Vibe', src: '🐸', category: 'Memes', tags: ['frog', 'meme', 'pepe'] },
  { id: 'p18', name: 'Floating Rocket', src: '🚀', category: 'Trending', tags: ['launch', 'crypto', 'moon'] },
];

export type PhoneScreenType = 'home' | 'chat' | 'social' | 'camera' | 'settings';

export interface PhoneScreenConfig {
  id: PhoneScreenType;
  label: string;
  icon: string;
  bgColor: string;
}
