import { useContext, useMemo } from "react";
import { userContext } from "../context/UserContext";

export const useUserRolePermissions = () => {
  const { user } = useContext(userContext) || {};
  const hasSidebarItem = useMemo(
    () => (item) => {
      return user?.sidebar_names?.includes(item);
    },
    [user]
  );

  const hasPermission = useMemo(
    () => (permission) => {
      return user?.permission_names?.includes(permission);
    },
    [user]
  );
  return { hasSidebarItem, hasPermission };
};
