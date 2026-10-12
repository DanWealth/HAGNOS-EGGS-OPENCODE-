# Hagnos Eggs Android wrapper

This Android app opens the hosted PWA at `https://hagnos-eggs.netlify.app/`.
It keeps navigation on that site in the app, sends other links to Android, and
supports the PWA's file upload picker.

Build a debug APK from this directory with:

```powershell
.\gradlew.bat assembleDebug
```

The APK is written to `app/build/outputs/apk/debug/app-debug.apk`. Debug APKs
are signed for direct installation and are not suitable for Play Store release.
