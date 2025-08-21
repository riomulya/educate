import AuthGuard from '@/components/guards/AuthGuard';
import MaterialDetailScene from '@/scenes/education/MaterialDetailScene';

export default function MaterialDetailPage() {
  return (
    <AuthGuard>
      <MaterialDetailScene />
    </AuthGuard>
  );
}
