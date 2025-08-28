# Auto-Login Feature

Fitur auto-login yang memungkinkan pengguna untuk tetap masuk ke aplikasi selama 1 hari (24 jam) setelah login terakhir mereka.

## Cara Kerja

1. **Saat Login**: Ketika pengguna berhasil login (baik melalui email/password atau Google Sign-In), aplikasi akan menyimpan timestamp dan user ID ke local storage.

2. **Saat App Start**: Ketika aplikasi dimulai, `AuthProvider` akan melakukan pengecekan auto-login:
   - Mengecek apakah ada data auto-login tersimpan
   - Memvalidasi apakah timestamp masih valid (kurang dari 24 jam)
   - Jika valid, mencoba mendapatkan session dari Supabase
   - Jika session valid dan user ID cocok, langsung masuk ke aplikasi

3. **Saat Logout**: Ketika pengguna logout, data auto-login akan dihapus dari local storage.

## Implementasi

### Hook useAutoLogin

Hook utama yang mengelola logic auto-login:

```typescript
// hooks/useAutoLogin.ts
const {
  saveAutoLoginData, // Simpan data auto-login
  checkAutoLogin, // Cek dan lakukan auto-login
  clearAutoLoginData, // Hapus data auto-login
  isAutoLoginValid, // Validasi timestamp
} = useAutoLogin();
```

### Durasi Auto-Login

```typescript
// Durasi: 1 hari (24 jam)
const AUTO_LOGIN_DURATION = 24 * 60 * 60 * 1000; // milliseconds
```

### Data Storage

Data disimpan menggunakan AsyncStorage dengan keys:

- `AUTO_LOGIN_TIMESTAMP`: Berisi timestamp dan user ID

### Integration Points

1. **useEmailAuth**: Menyimpan data auto-login saat login berhasil
2. **useGoogleSignIn**: Menyimpan data auto-login saat Google login berhasil
3. **AuthProvider**: Melakukan pengecekan auto-login saat app start
4. **Sign Out**: Menghapus data auto-login saat logout

## Security Considerations

1. **Expiration**: Data auto-login akan expired setelah 24 jam
2. **Session Validation**: Selalu memvalidasi session dengan Supabase
3. **User ID Matching**: Memastikan user ID dari storage cocok dengan session
4. **Auto Cleanup**: Data otomatis dihapus jika tidak valid atau expired

## User Experience

- Pengguna yang login dalam 24 jam terakhir akan langsung masuk ke aplikasi
- Pengguna yang sudah lebih dari 24 jam harus login ulang
- Proses auto-login transparan (tanpa interaksi user)
- Loading indicator ditampilkan saat proses pengecekan

## Error Handling

- Jika auto-login gagal, fallback ke regular auth initialization
- Error handling untuk AsyncStorage operations
- Graceful degradation jika Supabase session tidak valid

## Testing Scenarios

1. **Fresh Install**: User baru harus login manual
2. **Within 24 Hours**: User langsung masuk tanpa login
3. **After 24 Hours**: User harus login ulang
4. **Manual Logout**: Data auto-login dihapus, harus login ulang
5. **App Update**: Auto-login tetap berfungsi jika data masih valid
