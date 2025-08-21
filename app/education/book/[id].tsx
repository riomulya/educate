import AuthGuard from '@/components/guards/AuthGuard';
import BookDetailScene from '@/scenes/education/BookDetailScene';

export default function BookDetailPage() {
  return (
    <AuthGuard>
      <BookDetailScene />
    </AuthGuard>
  );
}
