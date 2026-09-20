# EmojiFloat Android wrapper

This is the native Android shell around the Figma-generated React/Vite app.

Open `android-native` in Android Studio. Build the web app first, copy `dist/` into
`app/src/main/assets/www/`, then build the APK. The native service uses Android's
Display over other apps permission to render floating emojis and base64 image stickers.
