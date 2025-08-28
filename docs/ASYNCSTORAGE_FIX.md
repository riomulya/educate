# AsyncStorage Fix untuk Session Persistence

## 🔥 Masalah Utama

**Session tidak tersimpan saat reload development** karena Supabase tidak dikonfigurasi untuk menggunakan AsyncStorage sebagai session storage.

## ✅ Solusi

### 1. Konfigurasi Supabase dengan AsyncStorage

```typescript
// utils/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage, // 🔑 KEY FIX: Use AsyncStorage for session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 2. Simplified AuthProvider Logic

```typescript
// components/providers/AuthProvider.tsx
// Prioritas baru:
1. Setup auth listener FIRST
2. Get initial session (triggers INITIAL_SESSION event)
3. Let Supabase handle session restoration from AsyncStorage
4. Only check auto-login if no session restored
```

### 3. Better Auth Event Handling

```typescript
case 'INITIAL_SESSION':
  if (session?.user) {
    console.log('✅ Session restored from AsyncStorage:', user?.email);
  } else {
    console.log('ℹ️ No session found in AsyncStorage, checking auto-login...');
    checkAutoLogin();
  }
  break;
```

## 🚀 Expected Behavior Now

### Development Reload:

1. **App starts** → AuthProvider initializes
2. **Supabase checks AsyncStorage** → Finds saved session
3. **INITIAL_SESSION event** → Session restored automatically
4. **User stays logged in** ✅

### Fresh App Start:

1. **App starts** → AuthProvider initializes
2. **No session in AsyncStorage** → INITIAL_SESSION with null
3. **Check auto-login** → Restore from auto-login data
4. **Session created** → Saved to AsyncStorage for next time

## 🧪 Test Commands

```javascript
// Check if AsyncStorage contains session data
AsyncStorage.getAllKeys().then(keys => {
  console.log(
    'AsyncStorage keys:',
    keys.filter(k => k.includes('supabase')),
  );
});

// Check specific session data
AsyncStorage.getItem('supabase.auth.token').then(console.log);
```

## 📝 Key Changes

1. **utils/supabase.ts**: Added `storage: AsyncStorage`
2. **AuthProvider.tsx**: Simplified logic, rely on Supabase events
3. **useAutoLogin.ts**: Better handling for session loading states

## 🎯 Result

- ✅ **Session persists** across development reloads
- ✅ **No more repeated logins**
- ✅ **AsyncStorage-based session storage**
- ✅ **Cleaner, simpler auth flow**
