import AuthGuard from '@/components/guards/AuthGuard';
import SignUpScene from '@/scenes/auth/SignUpScene';

export default function SignUpPage() {
  return (
    <AuthGuard requireAuth={false}>
      <SignUpScene />
    </AuthGuard>
  );
}
