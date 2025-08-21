import AuthGuard from '@/components/guards/AuthGuard';
import SignInScene from '@/scenes/auth/SignInScene';

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <SignInScene />
    </AuthGuard>
  );
}
