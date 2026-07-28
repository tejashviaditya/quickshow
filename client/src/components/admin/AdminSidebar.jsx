import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  ListIcon,
  ListCollapseIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom"; // it know wheter the current route is active or not if active-true



const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };
  const adminNavLinks = [ // links for admin dashboard
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];
  return (
    <div className="h-[calc(100vh-64px)] md:flex  flex-col items-center pt-8 max-w-52 md:max-w-64 w-full border-r border-gray-300/20 text-sm ">
      <img className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" src={user.imageUrl} alt="sidebar " />
      <p className="text-base max-md:hidden  mt-2">
        {user.firstName} {user.lastName}
      </p>
      <div className="w-full">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({isActive})=>` relative flex items-center max-md:justify-center gap-2 w-full md:pl-10 first:mt-6 text-gray-400 py-2.5  ${ isActive && 'bg-primary/15 text-primary group '}`}>
            {({isActive}) =>(
              <>
              <link.icon className="w-5 h-5" />
              <p className="max-md:hidden ">{link.name}</p>
              <span className={`w-1.5 h-10 rounded-l right-0 absolute ${ isActive && 'bg-primary/50'}`} />

              </>
            )
            }
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
