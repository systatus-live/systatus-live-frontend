import { useGlobalProvider } from '@/providers/GlobalProvider';
import { PermissionEnum } from '@/types/PermissionEnum';

export function usePermission(permission: PermissionEnum): boolean {
  const { permissionList } = useGlobalProvider();
  return permissionList.includes(permission);
}
