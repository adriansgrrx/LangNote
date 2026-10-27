import { Navigate } from 'react-router';
import { LoaderIcon } from 'lucide-react';

const ProtectedRoute = ({ user, authLoading, children }) => {
    if (authLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center text-primary">
                <LoaderIcon className="size-6 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;