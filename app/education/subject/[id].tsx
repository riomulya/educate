import AuthGuard from '@/components/guards/AuthGuard';
import SubjectDetailScene from '@/scenes/education/SubjectDetailScene';

export default function SubjectDetailPage() {
    return (
        <AuthGuard>
            <SubjectDetailScene />
        </AuthGuard>
    );
} 