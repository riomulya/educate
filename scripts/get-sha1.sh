#!/bin/bash

# Script untuk mendapatkan SHA-1 fingerprint untuk konfigurasi Google Sign-In

echo "=== Mendapatkan SHA-1 fingerprint untuk Android Debug Key ==="
echo ""

if [ -f ~/.android/debug.keystore ]; then
  echo "Debug keystore ditemukan di ~/.android/debug.keystore"
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep -A 1 "SHA1:"
else
  echo "Debug keystore tidak ditemukan di lokasi default"
  echo "Mencari di lokasi lain..."
  
  # Cek lokasi alternatif
  if [ -f "$ANDROID_HOME/debug.keystore" ]; then
    echo "Debug keystore ditemukan di $ANDROID_HOME/debug.keystore"
    keytool -list -v -keystore "$ANDROID_HOME/debug.keystore" -alias androiddebugkey -storepass android -keypass android | grep -A 1 "SHA1:"
  else
    echo "Debug keystore tidak ditemukan."
    echo ""
    echo "Opsi untuk mendapatkan SHA-1:"
    echo "1. Jalankan 'eas credentials' jika menggunakan EAS Build"
    echo "2. Buat debug keystore dengan: keytool -genkey -v -keystore debug.keystore -alias androiddebugkey -keyalg RSA -sigalg SHA1withRSA -keysize 2048 -validity 10000 -storepass android -keypass android"
  fi
fi

echo ""
echo "=== Petunjuk ==="
echo "1. Salin SHA-1 fingerprint di atas (format: XX:XX:XX:XX:XX:XX...)"
echo "2. Buka Google Cloud Console di https://console.cloud.google.com/"
echo "3. Pilih project Anda"
echo "4. Buka 'APIs & Services' > 'Credentials'"
echo "5. Buat atau edit OAuth 2.0 Client ID untuk Android"
echo "6. Tambahkan package name aplikasi Anda (com.riomulya.educate)"
echo "7. Tambahkan SHA-1 fingerprint yang sudah disalin"
echo "8. Simpan perubahan"
