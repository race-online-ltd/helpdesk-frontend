import React from "react";
import { Link } from "react-router-dom";
import { sidebarNavItems } from "../../../data/data";
import { useUserRolePermissions } from "../../custom-hook/useUserRolePermissions";

export const Sidebar = () => {
  const { hasSidebarItem } = useUserRolePermissions();
  return (
    <ul className='sidebar-nav'>
      {sidebarNavItems.map(
        (item, index) =>
          hasSidebarItem(item.title) && (
            <li key={index}>
              <Link to={item.link}>
                {item.icon}
                <p>{item.title}</p>
              </Link>
            </li>
          )
      )}
    </ul>
  );
};
