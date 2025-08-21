import AuthGuard from '@/components/guards/AuthGuard';
import QuizScene from '@/scenes/education/QuizScene';

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizScene />
    </AuthGuard>
  );
}
