export interface NativeOverlayBridge {
  requestPermission: () => void;
  start: (payload: string) => void;
  update: (payload: string) => void;
  stop: () => void;
}

declare global {
  interface Window {
    AndroidOverlay?: NativeOverlayBridge;
  }
}

export function hasNativeOverlay(): boolean {
  return typeof window !== 'undefined' && !!window.AndroidOverlay;
}

export function syncNativeOverlay(overlays: unknown[]): void {
  if (!window.AndroidOverlay) return;
  const payload = JSON.stringify(overlays);
  window.AndroidOverlay.update(payload);
}
