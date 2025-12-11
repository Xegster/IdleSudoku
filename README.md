# IdleSudoku
Idle Sudoku game done in React Native

## Development

### Running the Project

```bash
# Start Expo development server
npm start

# Run on web
npm run web

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Windows (web version - recommended for debugging)
npm run web

# Run on Windows (native - requires React Native Windows setup)
npm run windows
```

### Running as a Windows App

You can run this project as a Windows application in two ways:

#### Option 1: Web Version (Recommended for Debugging)
The web version runs in your browser and provides full debugging capabilities:
- **Run**: `npm run web`
- **Debug**: Use VS Code debug configurations (see below)
- **Advantages**: Full source map support, breakpoints, hot reload, easy debugging

#### Option 2: Native Windows App
For a true Windows desktop application, you'll need React Native Windows:
- **Run**: `npm run windows` (after setup)
- **Requirements**: Visual Studio 2022 with Windows SDK, React Native Windows dependencies
- **Setup**: See "Windows Native App Setup" section below

### Debugging on Windows

This project is configured for debugging in VS Code on Windows.

#### Prerequisites

1. Install recommended VS Code extensions (prompted automatically, or install manually):
   - Debugger for Chrome
   - Edge DevTools
   - React Native Tools (optional, for mobile debugging)

2. Ensure dependencies are installed:
   ```bash
   npm install
   ```

#### Debug Configurations

Available debug configurations in VS Code (F5 or Run > Start Debugging):

1. **Debug Expo (Web) - Chrome**: Launches Expo web in Chrome with debugging enabled (auto-starts server)
2. **Debug Expo (Web) - Edge**: Launches Expo web in Edge with debugging enabled (auto-starts server)
3. **Debug Expo (Web) - No PreLaunch**: Launches Chrome debugger (requires Expo to be running manually)
4. **Attach to Expo (Web)**: Attaches debugger to an already running Expo web instance
5. **Debug Expo (Android)**: Debugs Android app (requires Android emulator or device)
6. **Attach to React Native**: Attaches to a running React Native debugger

#### Quick Start Debugging

**Option 1: Automatic (Recommended)**
1. Press `F5` in VS Code
2. Select "Debug Expo (Web) - Chrome" or "Debug Expo (Web) - Edge"
3. Wait for the "expo:start-web" task to complete (check the terminal output)
4. The debugger will automatically open your browser

**Option 2: Manual Start (If preLaunchTask has issues)**
1. Open a terminal and run: `npm run web`
2. Wait for Expo to start (you'll see "Web is running" or similar)
3. Press `F5` and select "Debug Expo (Web) - No PreLaunch" or "Attach to Expo (Web)"
4. Set breakpoints in your `.js` or `.jsx` files
5. The debugger will pause at breakpoints

#### Troubleshooting

**Blank page when debugging:**
- The preLaunchTask might not be detecting when Expo is ready
- Solution: Use "Debug Expo (Web) - No PreLaunch" configuration instead
- Or manually start Expo first, then use "Attach to Expo (Web)"

**"Waiting for prelaunchtask" notification:**
- The task is still starting up - wait a bit longer
- Check the terminal output to see if Expo is actually starting
- If it hangs, cancel and use the manual debugging approach above

### Windows Native App Setup (Optional)

If you want to run as a true Windows desktop app (not web), you'll need to set up React Native Windows:

#### Prerequisites
1. **Visual Studio 2022** with:
   - Desktop development with C++ workload
   - Windows 10/11 SDK (latest version)
   - MSVC v143 compiler toolset

2. **Node.js** (already installed)

3. **Windows App SDK** (optional, for modern Windows features)

#### Setup Steps
1. Install React Native Windows:
   ```bash
   npx react-native-windows-init --overwrite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Windows app:
   ```bash
   npm run windows
   ```

4. **Debug in Visual Studio**:
   - Open `windows/IdleSudoku.sln` in Visual Studio
   - Set breakpoints in your JavaScript/TypeScript files
   - Press F5 to start debugging
   - The debugger will attach to both native and JavaScript code

5. **Debug in VS Code** (JavaScript only):
   - Use the "Attach to React Native" configuration
   - Or add a Windows-specific debug configuration

**Note**: Expo managed projects may require ejecting or using Expo Development Build for full Windows support. The web version is recommended for easier debugging.

## Deployment

Connect to Expo
```bash
npx eas-cli@latest init --id 38be4db9-a5b8-4b8d-968d-768e175a5933
```

Submit to app stores
```bash
npx eas-cli@latest build --platform all --auto-submit
```