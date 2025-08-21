import AuthGuard from '@/components/guards/AuthGuard';
import SubjectsScene from '@/scenes/education/SubjectsScene';

export default function EducationPage() {
    return (
        <AuthGuard>
            <SubjectsScene />
        </AuthGuard>
    );
} 