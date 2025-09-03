import { NavLink } from "react-router-dom";
import { Home, BookOpen, Users, UserRound } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/manage-books", icon: BookOpen, label: "Manage Books" },
    { to: "/borrows", icon: Users, label: "Borrower Management" },
    { to: "/profile", icon: UserRound, label: "Profile" },
  ];

  return (
    <div className="w-72 bg-white shadow-lg p-4">
      {/* Brand Logo */}
      <h1 className="flex items-center justify-center gap-2 text-xl font-bold mb-6 text-blue-900">
        <BookOpen size={24} className="text-blue-600" />
        BookHive
      </h1>

      {/* Sidebar Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
