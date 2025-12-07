import { ReactNode } from 'react';
import { UserProfile, hasPermission } from '../services/userService';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  userProfile: UserProfile | null;
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ userProfile, permission, children, fallback }: PermissionGuardProps) {
  if (!hasPermission(userProfile, permission)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-gray-200">
        <Lock className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600 text-center">
          You don't have permission to access this feature.
          <br />
          Contact your administrator for access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}