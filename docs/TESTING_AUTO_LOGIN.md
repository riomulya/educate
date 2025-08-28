# Testing Auto-Login Functionality

## 🧪 Manual Testing Steps

### Test 1: Development Reload (Critical Fix)

```bash
1. Jalankan app: npm run dev
2. Login dengan email/password atau Google
3. Pastikan masuk ke /education screen
4. Di terminal, tekan 'r' untuk reload
5. ✅ EXPECTED: User tetap login, langsung ke /education
6. ❌ SEBELUMNYA: User harus login ulang
```

### Test 2: App Restart

```bash
1. Login dengan akun apapun
2. Close app completely (stop metro server)
3. Restart app: npm run dev
4. ✅ EXPECTED: Auto-login dalam 24 jam
```

### Test 3: Session Validation

```bash
1. Login dan lihat log:
   - ✅ "Auto-login data saved successfully for user: email@example.com"
   - ✅ "Auto-login will be valid until: [timestamp]"
2. Reload beberapa kali
3. ✅ EXPECTED: Log menunjukkan "Found existing session for user: email"
```

## 🔍 Debug Commands

### Check AsyncStorage Data

```javascript
// Di React Native Debugger atau console:
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check auto-login data
AsyncStorage.getItem('AUTO_LOGIN_TIMESTAMP').then(console.log);

// Check all keys
AsyncStorage.getAllKeys().then(keys => {
  console.log('AsyncStorage keys:', keys);
});
```

### Monitor Auth State

```javascript
// Log yang harus muncul di console:
console.log('🚀 Initializing AuthProvider...');
console.log('✅ Found existing session for user:', email);
console.log('🔍 Checking for auto-login...');
console.log('✅ Auto-login data is valid, timestamp:', timestamp);
```

## 📊 Expected Log Flow

### Successful Development Reload:

```
🚀 Initializing AuthProvider...
✅ Found existing session for user: riomulya79@gmail.com
Auth state changed: INITIAL_SESSION 491b7106-096e-4c95-9a8f-38bf5f3d2692
```

### Auto-Login from Storage:

```
🚀 Initializing AuthProvider...
ℹ️ No existing session found, checking auto-login...
🔍 Checking for auto-login...
✅ Auto-login data is valid, timestamp: 12/19/2024, 10:30:15 AM
✅ Auto-login successful for user: riomulya79@gmail.com
```

### Clean State (No Login):

```
🚀 Initializing AuthProvider...
ℹ️ No existing session found, checking auto-login...
🔍 Checking for auto-login...
ℹ️ No auto-login data found
```

## ⚠️ Troubleshooting

### If Auto-Login Still Not Working:

1. **Clear AsyncStorage:**

```javascript
AsyncStorage.clear().then(() => console.log('Storage cleared'));
```

2. **Check Session Validity:**

```javascript
import { supabase } from '@/utils/supabase';
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Current session:', data.session?.user?.email);
  console.log('Session error:', error);
});
```

3. **Manual Session Restore:**

```javascript
// Jika session ada tapi tidak ter-restore
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session?.user?.email);
});
```

## 🎯 Success Criteria

- [ ] ✅ Development reload keeps user logged in
- [ ] ✅ Auto-login works for 24 hours
- [ ] ✅ Expired auto-login redirects to login
- [ ] ✅ User mismatch clears auto-login data
- [ ] ✅ Logout clears auto-login data
- [ ] ✅ No infinite loading states
- [ ] ✅ Clean console logs for debugging

## 🔧 Quick Fix Commands

### Reset Everything:

```bash
# Clear Metro cache
npx expo start -c

# Clear AsyncStorage in app
AsyncStorage.clear()

# Fresh login test
```

### Force Auto-Login Test:

```javascript
// Set fake auto-login data (in development only)
const testData = {
  timestamp: Date.now(),
  userId: 'your-user-id',
  userEmail: 'test@example.com',
  expiresAt: Date.now() + 24 * 60 * 60 * 1000,
};
AsyncStorage.setItem('AUTO_LOGIN_TIMESTAMP', JSON.stringify(testData));
```
