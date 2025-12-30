# Android APK Build Plan

## Overview

This plan details how to generate an Android APK locally for the IdleSudoku Expo project without using Expo's cloud build service. The process involves generating native Android code, setting up the Android development environment, and building the APK using Gradle.

## Current Project State

- **Project Type**: Expo managed project (using Expo Router)
- **Package Name**: `com.idlesudoku.app` (configured in `app.json`)
- **Missing Assets**: Icon, splash screen, and adaptive icon files referenced in `app.json` need to be created
- **No Native Folders**: Android/iOS native folders don't exist yet (will be generated via `expo prebuild`)

## Prerequisites

### 1. Software Requirements

- **Node.js** (already installed)
- **Java Development Kit (JDK)** - Version 17 or 21 (required for Android builds)
  - Download from: https://adoptium.net/ or Oracle JDK
  - Set `JAVA_HOME` environment variable
- **Android Studio** - Latest stable version
  - Download from: https://developer.android.com/studio
  - Install Android SDK (API level 33 or higher recommended)
  - Install Android SDK Build Tools
  - Install Android SDK Platform Tools
- **Android SDK Command Line Tools** (optional, if not using Android Studio GUI)
- **Git** (for version control)

### 2. Environment Variables

Set the following environment variables:

- `JAVA_HOME` - Path to JDK installation (e.g., `C:\Program Files\Java\jdk-17`)
- `ANDROID_HOME` - Path to Android SDK (typically `%LOCALAPPDATA%\Android\Sdk` on Windows)
- Add to PATH:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`
  - `%ANDROID_HOME%\tools\bin`
  - `%JAVA_HOME%\bin`

### 3. Verify Installation

```bash
java -version          # Should show JDK 17 or 21
adb version            # Should show Android Debug Bridge version
```

## Implementation Steps

### Step 1: Create Missing Assets

Before generating native code, create the required asset files referenced in `app.json`:

- `assets/icon.png` - App icon (1024x1024px recommended)
- `assets/splash.png` - Splash screen image
- `assets/adaptive-icon.png` - Adaptive icon foreground (1024x1024px)

**Note**: These can be placeholder images initially, but proper assets should be created before final release.

### Step 2: Generate Native Android Project

Run Expo prebuild to generate the native Android project structure:

```bash
npx expo prebuild --platform android
```

This will:

- Create `android/` folder with native Android project
- Generate `android/app/build.gradle` with build configuration
- Create `android/app/src/main/AndroidManifest.xml`
- Set up Gradle wrapper and build scripts

### Step 3: Configure Android Build Settings

After prebuild, review and update these files if needed:

**`android/app/build.gradle`**:

- Verify `applicationId` matches `com.idlesudoku.app`
- Check `minSdkVersion` (should be 21 or higher for modern React Native)
- Verify `targetSdkVersion` (should be 33 or higher)
- Review dependencies and versions

**`android/build.gradle`**:

- Verify Gradle version compatibility
- Check Android Gradle Plugin version

### Step 4: Set Up Signing Configuration (For Release APK)

Create a keystore for signing release builds:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/idlesudoku-release-key.keystore -alias idlesudoku-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important**:

- Store the keystore file securely (add `*.keystore` to `.gitignore` - already present)
- Save the keystore password and key alias password securely
- Never commit keystore files to version control

Create `android/gradle.properties` (if it doesn't exist) and add:

```properties
MYAPP_RELEASE_STORE_FILE=idlesudoku-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=idlesudoku-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

**Note**: For development/debug builds, Android uses a default debug keystore automatically.

Update `android/app/build.gradle` to use the release keystore:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Step 5: Install Dependencies

Install all npm dependencies:

```bash
npm install
```

### Step 6: Build Debug APK (Testing)

Build a debug APK first to verify everything works:

```bash
cd android
./gradlew assembleDebug
```

On Windows (PowerShell):

```powershell
cd android
.\gradlew.bat assembleDebug
```

The APK will be generated at:

`android/app/build/outputs/apk/debug/app-debug.apk`

### Step 7: Build Release APK

Build the release APK:

```bash
cd android
./gradlew assembleRelease
```

On Windows (PowerShell):

```powershell
cd android
.\gradlew.bat assembleRelease
```

The APK will be generated at:

`android/app/build/outputs/apk/release/app-release.apk`

### Step 8: Generate AAB (Optional - For Play Store)

If planning to publish to Google Play Store, generate an Android App Bundle:

```bash
cd android
./gradlew bundleRelease
```

On Windows:

```powershell
cd android
.\gradlew.bat bundleRelease
```

The AAB will be at:

`android/app/build/outputs/bundle/release/app-release.aab`

## Build Scripts (Optional Enhancement)

Add convenient npm scripts to `package.json`:

```json
{
  "scripts": {
    "android:prebuild": "expo prebuild --platform android",
    "android:build:debug": "cd android && gradlew.bat assembleDebug",
    "android:build:release": "cd android && gradlew.bat assembleRelease",
    "android:build:bundle": "cd android && gradlew.bat bundleRelease"
  }
}
```

## Troubleshooting

### Common Issues

1. **"SDK location not found"**

   - Set `ANDROID_HOME` environment variable
   - Or create `android/local.properties` with: `sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk`

2. **"JAVA_HOME not set"**

   - Set `JAVA_HOME` environment variable to JDK installation path
   - Restart terminal/IDE after setting

3. **Gradle build fails**

   - Check internet connection (Gradle downloads dependencies)
   - Verify Android SDK components are installed
   - Check `android/build.gradle` for version compatibility

4. **"Execution failed for task ':app:mergeReleaseResources'"**

   - Clean build: `cd android && ./gradlew clean`
   - Rebuild: `./gradlew assembleRelease`

5. **Metro bundler issues**

   - Ensure Metro config is compatible with native build
   - Check `metro.config.js` for any custom configurations

6. **SSL Certificate errors when downloading Gradle**

   - Error: "PKIX path building failed: unable to find valid certification path"
   - This typically occurs on corporate networks or with VPNs
   - Solutions:
     - Update Java to JDK 17+ (recommended)
     - Configure Java truststore with corporate certificates if on corporate network
     - Temporarily disable VPN to download Gradle (then re-enable)
     - Manually download Gradle distribution and place in `~/.gradle/wrapper/dists/`

## File Structure After Prebuild

```
IdleSudoku/
├── android/                    # Generated native Android project
│   ├── app/
│   │   ├── build.gradle
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       └── res/
│   │   └── build/outputs/apk/
│   ├── build.gradle
│   ├── gradle.properties
│   ├── settings.gradle
│   └── gradlew / gradlew.bat
├── app.json                    # Expo configuration
├── package.json
└── ...
```

## Next Steps After APK Generation

1. **Test the APK**: Install on a physical Android device or emulator
2. **Verify functionality**: Test all app features work correctly
3. **Optimize**: Consider enabling ProGuard/R8 for code shrinking (if needed)
4. **Update version**: Update version in `app.json` before each release
5. **Documentation**: Update README with build instructions

## Important Notes

- The `android/` folder will be generated and should be added to version control (unless using `.gitignore` to exclude it)
- After `expo prebuild`, you can continue using Expo development tools, but native changes require rebuilding
- For future updates, run `expo prebuild` again if `app.json` changes affect native configuration
- Debug builds are larger and include debugging symbols; release builds are optimized and smaller
- Release APKs must be signed; debug APKs use auto-generated debug keystore

## References

- [Expo Prebuild Documentation](https://docs.expo.dev/workflow/prebuild/)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Gradle Build Configuration](https://developer.android.com/studio/build)

