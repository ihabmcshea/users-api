// hoc/withAuth.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'app/context/AuthContext';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, requiredRoles: string[] = []) => {
    const Wrapper: React.FC<P> = (props) => {
        const { user, isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        React.useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/login'); // Redirect to login page if not authenticated
            } else if (!isLoading && user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
                router.push('/unauthorized'); // Redirect to unauthorized page if user role is not permitted
            }
        }, [isAuthenticated, isLoading, router, user, requiredRoles]);

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return isAuthenticated && (requiredRoles.length === 0 || requiredRoles.includes(user?.role || '')) ?
            <WrappedComponent {...props} /> : null;
    };

    return Wrapper;
};

export default withAuth;
