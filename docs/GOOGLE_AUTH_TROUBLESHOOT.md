# Mengatasi Error Google Sign-In

## DEVELOPER_ERROR pada Google Sign-In

Jika Anda mengalami DEVELOPER_ERROR saat menggunakan Google Sign-In, ikuti langkah-langkah ini:

### 1. Verifikasi SHA-1 Fingerprint

Untuk build development:

```bash
# Untuk mendapatkan SHA-1 dari keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Untuk build production dengan EAS:

```bash
# Dapatkan SHA-1 dari credential EAS
eas credentials
```

### 2. Update Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project yang sesuai
3. Buka **APIs & Services** -> **Credentials**
4. Temukan OAuth 2.0 Client IDs atau buat baru jika belum ada
5. Tambahkan **package name** aplikasi Anda (contoh: com.riomulya.educate)
6. Tambahkan **SHA-1** yang sudah Anda dapatkan
7. Simpan perubahan

### 3. Perbarui Config di App

Pastikan `app.config.ts` atau `app.json` memiliki:

```typescript
extra: {
  // ...
  webOAuthId: "123456789-abcdefg.apps.googleusercontent.com", // Web Client ID dari Google Cloud Console
  androidOAuthId: "123456789-hijklmn.apps.googleusercontent.com", // Android Client ID dari Google Cloud Console
}
```

### 4. Konfigurasi yang Benar pada GoogleSignin

```typescript
GoogleSignin.configure({
  webClientId: config.webOAuthId, // Client ID untuk Web Application (OAuth 2.0 client ID)
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
});

// CATATAN: Jangan gunakan androidClientId - tidak valid dalam versi terbaru
// ERROR: RNGoogleSignIn: `androidClientId` is not a valid configuration parameter, please remove it.
```

### 5. Periksa Supabase

1. Pastikan provider Google sudah diaktifkan di Supabase Dashboard
2. Verifikasi Client ID dan Client Secret sudah diisi dengan benar
3. Tambahkan URL redirect yang sesuai, contoh:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - `educate://auth/callback`

### 6. Debug Error

Cek log error untuk informasi lebih detail:

```typescript
catch (error: any) {
  console.error('❌ Google Sign-In error details:',
    error.code,
    error.message,
    JSON.stringify(error, null, 2)
  );
  // Handle error
}
```

### 7. Cara Reset Google Sign-In

Jika masih mengalami masalah:

1. Hapus data aplikasi Google Play Services
2. Reset perangkat (jika diperlukan)
3. Pastikan GoogleSignin.signOut() dipanggil setelah logout
