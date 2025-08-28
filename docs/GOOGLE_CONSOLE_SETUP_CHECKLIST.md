# Google Cloud Console Setup Checklist

## 🔧 Informasi Aplikasi Anda

- **Package Name**: `com.educate.app`
- **SHA-1 Fingerprint**: `45:C7:12:AA:F9:18:DC:DD:76:60:66:89:53:E5:18:9A:78:1B:27:EA`
- **Supabase Project**: `ubexnlxdtdrqbbsxiexi`

## ✅ Checklist Google Cloud Console

### 1. Project Setup

- [ ] Buka https://console.cloud.google.com/
- [ ] Pilih atau buat project
- [ ] Enable APIs yang diperlukan:
  - [ ] Google+ API
  - [ ] Google Identity Services API
  - [ ] OAuth2 API

### 2. OAuth Consent Screen

- [ ] Buka **APIs & Services** → **OAuth consent screen**
- [ ] Pilih **External**
- [ ] Isi informasi wajib:
  - App name: `Educate`
  - User support email: (email Anda)
  - Developer contact: (email Anda)
- [ ] Tambahkan Scopes:
  - [ ] `../auth/userinfo.email`
  - [ ] `../auth/userinfo.profile`
  - [ ] `openid`
- [ ] Tambahkan Test users: (email Gmail Anda)

### 3. OAuth 2.0 Client IDs

#### A. Web Application (untuk Supabase)

- [ ] Buka **APIs & Services** → **Credentials**
- [ ] Klik **Create Credentials** → **OAuth 2.0 Client ID**
- [ ] Application type: **Web application**
- [ ] Name: `Educate Web Client`
- [ ] Authorized redirect URIs:
  - [ ] `https://ubexnlxdtdrqbbsxiexi.supabase.co/auth/v1/callback`
- [ ] Salin **Client ID** dan **Client Secret**

#### B. Android Application (untuk React Native)

- [ ] Buat OAuth 2.0 Client ID baru
- [ ] Application type: **Android**
- [ ] Name: `Educate Android Client`
- [ ] Package name: `com.educate.app`
- [ ] SHA-1 certificate fingerprint: `45:C7:12:AA:F9:18:DC:DD:76:60:66:89:53:E5:18:9A:78:1B:27:EA`
- [ ] Salin **Client ID**

## 🔗 Supabase Configuration

- [ ] Buka https://supabase.com/dashboard
- [ ] Pilih project: `ubexnlxdtdrqbbsxiexi`
- [ ] Buka **Authentication** → **Providers** → **Google**
- [ ] Enable Google provider: **ON**
- [ ] Client ID: (Web Client ID dari Google Console)
- [ ] Client Secret: (Web Client Secret dari Google Console)
- [ ] Save

## 🔍 Verifikasi

- [ ] Test OAuth URL: `https://ubexnlxdtdrqbbsxiexi.supabase.co/auth/v1/authorize?provider=google`
- [ ] Harus redirect ke Google OAuth (bukan error "provider not enabled")

## 📱 App Configuration (Sudah Benar)

Current config di `app.config.ts`:

```typescript
webOAuthId: '292474871516-vtgi44pradraqeo4km9r2hnbqpp4sk9g.apps.googleusercontent.com';
```

## ⚠️ Common Issues

1. **Package name mismatch**: Pastikan `com.educate.app` di Google Console
2. **SHA-1 fingerprint salah**: Gunakan `45:C7:12:AA:F9:18:DC:DD:76:60:66:89:53:E5:18:9A:78:1B:27:EA`
3. **Client ID salah**: Pastikan menggunakan Web Client ID untuk GoogleSignin.configure()
4. **Supabase provider disabled**: Enable Google provider di Supabase

## 🚨 Critical Notes

- **Web Client ID** digunakan untuk GoogleSignin.configure() di React Native
- **Android Client ID** TIDAK digunakan di kode (deprecated di v15.0.0)
- SHA-1 fingerprint harus EXACT match dengan debug keystore Anda
