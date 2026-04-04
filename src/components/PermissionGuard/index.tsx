import { usePermission } from '@/hooks/usePermission';
import { PermissionEnum } from '@/types/PermissionEnum';
import { ReactNode } from 'react';

type Props = {
  permission: PermissionEnum;
  children: ReactNode;
  fallback?: ReactNode;
};

export function PermissionGuard({ permission, children, fallback = null }: Props) {
  const hasPermission = usePermission(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
