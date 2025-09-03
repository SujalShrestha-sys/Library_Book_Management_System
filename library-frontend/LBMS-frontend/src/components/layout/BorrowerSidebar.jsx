import { NavLink } from "react-router-dom";
import { Home, BookOpen, Library, UserRound, PhoneCall } from "lucide-react";

const BorrowerSidebar = () => {
  const navItems = [
    { to: "/borrower-dashboard", icon: Home, label: "Dashboard" },
    { to: "/manageBooks", icon: Library, label: "Manage Books" },
    { to: "/my-books", icon: BookOpen, label: "My Books" },
    { to: "/borrower-profile", icon: UserRound, label: "Profile" },
    { to: "/contact-us", icon: PhoneCall, label: "Contact Us" },
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

export default BorrowerSidebar;
