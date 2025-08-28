# Authentication Guide

This project uses Supabase for authentication with a focus on email/password authentication.

## Getting Started

### Setting Up Environment

1. Make sure your Supabase project is set up correctly
2. Configure authentication in your Supabase dashboard
3. Update your app.json and app.config.ts with the correct Supabase URL and key

### Authentication Methods

Currently, the app supports:

- Email/Password Authentication
- Google OAuth Authentication with native account picker

## Google OAuth Setup

Google OAuth has been implemented using the native Google Sign-In SDK for better user experience:

1. The app uses `@react-native-google-signin/google-signin` for native integration
2. OAuth is properly configured in the Supabase dashboard
3. Google Cloud Platform project is set up with required credentials

### Using Google Sign-In

1. The implementation shows Google account picker directly within the app
2. Uses native Google Sign-In SDK instead of WebBrowser redirection
3. Authentication token is passed to Supabase for verification

## Troubleshooting

### Common Issues

#### Email Login Not Working

- Check that the email exists in your Supabase project
- Make sure the password is correct
- Ensure your Supabase key has proper permissions

#### Google OAuth Issues

If Google login isn't working properly:

1. Verify Google Cloud Platform configuration (see SUPABASE_GOOGLE_SETUP.md)
2. Ensure Web Client ID in `app.config.ts` is correct and updated
3. Check that the Supabase Google provider is enabled
4. Verify app is using the latest Google Play Services

## User Management

### Creating a New User

1. Use the Sign Up form
2. Provide valid email, name and password
3. If email confirmation is enabled, check email for verification link

### Resetting Password

1. Click "Forgot Password" on the sign in screen
2. Enter your email address
3. Check your email for password reset instructions

## Implementation Details

Authentication is implemented using:

1. Supabase Auth API for backend authentication
2. Redux for state management
3. Custom hooks for authentication logic

## Security Considerations

- JWT tokens are stored securely
- Sessions are managed by Supabase
- Passwords are never stored in plaintext

## Customizing Authentication

To customize the authentication flow:

1. Edit services/authService.ts for backend changes
2. Modify hooks/useEmailAuth.ts for logic changes
3. Update components/providers/AuthProvider.tsx for global auth state

## API Reference

See [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) for more details on the auth API.
