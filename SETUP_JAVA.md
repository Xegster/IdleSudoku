# Setting JAVA_HOME and PATH on Windows

This guide explains how to set the `JAVA_HOME` environment variable and update your PATH on Windows 10/11.

## Method 1: Using Windows GUI (Recommended)

### Step 1: Find Your JDK Installation Path

After installing JDK 17 or 21, note the installation path. Common locations:
- `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`
- `C:\Program Files\Java\jdk-17`
- `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot\`

**To verify the path:**
1. Open File Explorer
2. Navigate to `C:\Program Files\Eclipse Adoptium\` (or `C:\Program Files\Java\`)
3. Look for a folder named `jdk-17` or `jdk-21` (version numbers may vary)
4. Copy the full path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot`)

### Step 2: Open Environment Variables Settings

1. Press `Windows Key + X` and select **System**
2. Click **Advanced system settings** (on the right side)
3. Click the **Environment Variables** button at the bottom

Alternatively:
1. Press `Windows Key + R`
2. Type `sysdm.cpl` and press Enter
3. Click the **Advanced** tab
4. Click **Environment Variables**

### Step 3: Set JAVA_HOME

1. In the **System variables** section (bottom half), click **New...**
2. Variable name: `JAVA_HOME`
3. Variable value: Paste your JDK path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot`)
4. Click **OK**

**Important:** Do NOT include `\bin` in the JAVA_HOME path. JAVA_HOME should point to the JDK root directory.

### Step 4: Update PATH

1. In the **System variables** section, find and select the `Path` variable
2. Click **Edit...**
3. Click **New**
4. Add: `%JAVA_HOME%\bin`
5. Click **OK** on all dialogs

**Note:** Using `%JAVA_HOME%\bin` is preferred because it automatically updates if you change JAVA_HOME later.

### Step 5: Verify the Changes

1. Close all open terminal/PowerShell windows
2. Open a **new** PowerShell or Command Prompt window
3. Run these commands:

```powershell
java -version
```

You should see something like:
```
openjdk version "17.0.12" 2024-10-15
OpenJDK Runtime Environment Temurin-17.0.12+7 (build 17.0.12+7)
OpenJDK 64-Bit Server VM Temurin-17.0.12+7 (build 17.0.12+7, mixed mode, sharing)
```

```powershell
echo $env:JAVA_HOME
```

Should show your JDK path:
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot
```

## Method 2: Using PowerShell (Administrator)

If you prefer command-line, you can set these using PowerShell as Administrator:

### Step 1: Open PowerShell as Administrator

1. Press `Windows Key + X`
2. Select **Windows PowerShell (Admin)** or **Terminal (Admin)**

### Step 2: Set JAVA_HOME (System-wide)

```powershell
# Replace with your actual JDK path
$javaPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot"

# Set JAVA_HOME
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaPath, [System.EnvironmentVariableTarget]::Machine)

# Add to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::Machine)
$newPath = "$currentPath;%JAVA_HOME%\bin"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, [System.EnvironmentVariableTarget]::Machine)
```

### Step 3: Verify

Close and reopen PowerShell, then verify:

```powershell
java -version
echo $env:JAVA_HOME
```

## Method 3: User-Level (Current User Only)

If you don't have administrator access, you can set JAVA_HOME for your user only:

### Using GUI:
1. Follow Method 1, but use **User variables** (top half) instead of **System variables**
2. Set JAVA_HOME and PATH in the User variables section

### Using PowerShell (No Admin Required):

```powershell
# Replace with your actual JDK path
$javaPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot"

# Set JAVA_HOME for current user
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaPath, [System.EnvironmentVariableTarget]::User)

# Add to PATH for current user
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*%JAVA_HOME%\bin*") {
    $newPath = "$currentPath;%JAVA_HOME%\bin"
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, [System.EnvironmentVariableTarget]::User)
}
```

## Troubleshooting

### Java version still shows old version

1. **Close all terminal windows** - Environment variables are loaded when terminals start
2. Open a new PowerShell/Command Prompt window
3. Verify with `java -version`

### JAVA_HOME not found

1. Check the path is correct (no typos, correct folder name)
2. Verify the JDK is actually installed at that location
3. Make sure you're checking the right variable scope (User vs System)

### Multiple Java versions installed

If you have multiple Java versions:
1. Set JAVA_HOME to the version you want to use (17 or 21)
2. Make sure `%JAVA_HOME%\bin` is at the **beginning** of your PATH (or remove other Java paths)
3. You can check which Java is being used: `where.exe java`

### PATH variable is too long

If you see an error about PATH being too long:
1. Use `%JAVA_HOME%\bin` instead of the full path in PATH
2. This keeps PATH shorter and makes it easier to update later

## Quick Verification Script

Run this in PowerShell to check your Java setup:

```powershell
Write-Host "Java Version:" -ForegroundColor Cyan
java -version

Write-Host "`nJAVA_HOME:" -ForegroundColor Cyan
echo $env:JAVA_HOME

Write-Host "`nJava Executable Location:" -ForegroundColor Cyan
where.exe java

Write-Host "`nJava Compiler (javac):" -ForegroundColor Cyan
javac -version
```

All commands should work without errors if Java is properly configured.

## Next Steps

After setting JAVA_HOME and PATH:
1. Close all terminal windows
2. Open a new PowerShell window
3. Navigate to your project: `cd C:\Development\IdleSudoku\android`
4. Run: `.\gradlew.bat assembleDebug`

The build should now proceed past the Java version check!

