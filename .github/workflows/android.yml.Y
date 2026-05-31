name: Build Android APK

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Build React (Vite) app
        run: npm run build

      - name: Install Capacitor
        run: npm install @capacitor/core @capacitor/cli @capacitor/android

      - name: Initialize Capacitor
        run: npx cap init easy-convert com.easy.convert --web-dir=dist

      - name: Add Android platform (safe check)
        run: |
          if [ ! -d "android" ]; then
            npx cap add android
          fi

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Build APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
