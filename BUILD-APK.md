# Build EmojiFloat as an APK

This project is a Figma Make React/Vite app plus a native Android wrapper. The important feature is the real system-wide floating emoji/sticker overlay.

## 1. Install prerequisites on Windows

- Node.js 20+ (22 is fine)
- Android Studio
- Android SDK Platform 35
- Android SDK Build-Tools 35.x

## 2. Build the React app

From the project root:

```powershell
npm install
npm run build
```

Then copy the web build into the Android assets:

```powershell
Remove-Item -Recurse -Force android-native/app/src/main/assets/www -ErrorAction SilentlyContinue
New-Item -ItemType Directory android-native/app/src/main/assets/www -Force | Out-Null
Copy-Item -Recurse dist/* android-native/app/src/main/assets/www/
```

Or run:

```powershell
.
android-native\copy-web-assets.ps1
```

## 3. Open Android Studio

Open the `android-native` folder.

Let Android Studio sync Gradle and install any missing SDK components.

Connect an Android phone with USB debugging enabled, or start an emulator.

## 4. Build APK

Android Studio:

**Build → Generate App Bundle(s) / APK(s) → Generate APK(s)**

The debug APK will normally be under:

`android-native/app/build/outputs/apk/debug/app-debug.apk`

## 5. First launch

Open EmojiFloat Studio and press **Start Floating**.

Android will ask for **Display over other apps** permission. Enable it and return to the app.

The initial emojis should appear over other apps. Add a preset, image sticker, or video sticker and the native overlay is synchronized automatically.

## Important

Android deliberately requires explicit overlay permission. This project does not bypass that security control.
