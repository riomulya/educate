# 🚨 **URGENT: Fix "provider is not enabled" Error**

## 🔧 **Step 1: Setup Google Cloud Console**

### **A. Create Google Cloud Project**

1. Go to: https://console.cloud.google.com/
2. Create new project atau pilih existing
3. Note down **Project ID**

### **B. Enable APIs**

```
APIs & Services → Library → Search:
1. "Google+ API" → Enable
2. "Google Identity" → Enable
3. "OAuth2 API" → Enable
```

### **C. Configure OAuth Consent Screen**

```
APIs & Services → OAuth consent screen

1. Choose: External
2. Fill required info:
   - App name: "Educate App"
   - User support email: your-email@gmail.com
   - App domain: (leave empty for now)
   - Developer contact: your-email@gmail.com

3. Scopes: Add these scopes
   - ../auth/userinfo.email
   - ../auth/userinfo.profile
   - openid

4. Test users: Add your Gmail for testing
```

### **D. Create OAuth 2.0 Client ID**

```
APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID

1. Application type: Web application
2. Name: "Educate Web Client"
3. Authorized redirect URIs:
   - https://ubexnlxdtdrqbbsxiexi.supabase.co/auth/v1/callback

4. Click CREATE
5. Copy Client ID dan Client Secret
```

## 🔧 **Step 2: Enable di Supabase**

### **A. Open Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project: `ubexnlxdtdrqbbsxiexi`

### **B. Configure Google Provider**

```
Authentication → Providers → Google

1. Enable Google provider: Toggle ON ✅
2. Client ID: [paste dari Google Console]
3. Client Secret: [paste dari Google Console]
4. Click SAVE

Redirect URL (auto-generated):
https://ubexnlxdtdrqbbsxiexi.supabase.co/auth/v1/callback
```

### **C. Configure Site URL**

```
Authentication → Settings → Site URL

Site URL: http://localhost:8081 (for development)

Additional Redirect URLs:
- exp://192.168.1.100:8081/--/auth/callback
- educate://auth/callback
- http://localhost:8081
```

## ✅ **Verification**

After setup, test di browser:

```
https://ubexnlxdtdrqbbsxiexi.supabase.co/auth/v1/authorize?provider=google
```

Jika berhasil → akan redirect ke Google OAuth
Jika masih error → provider belum enabled dengan benar

---

**🚨 IMPORTANT:** Tanpa step ini, OAuth akan selalu error "provider is not enabled"!
