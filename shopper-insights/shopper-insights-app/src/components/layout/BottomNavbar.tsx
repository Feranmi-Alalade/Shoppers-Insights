import Link from "next/link";
import {
  Home,
  Receipt,
  LayoutDashboard,
  BarChart2,
  Users,
} from "lucide-react";
export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 flex items-center justify-around h-16">
      <Link
        href="/"
        className="flex flex-col items-center text-gray-700 hover:text-primary"
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/dashboard"
        className="flex flex-col items-center text-gray-700 hover:text-primary"
      >
        <LayoutDashboard size={24} />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link
        href="/analytics"
        className="flex flex-col items-center text-gray-700 hover:text-primary"
      >
        <BarChart2 size={24} />
        <span className="text-xs">Insights</span>
      </Link>
      <Link
        href="/community"
        className="flex flex-col items-center text-gray-700 hover:text-primary"
      >
        <Users size={24} />
        <span className="text-xs">Community</span>
      </Link>
      <Link
        href="/receipts"
        className="flex flex-col items-center text-gray-700 hover:text-primary"
      >
        <Receipt size={24} />
        <span className="text-xs">Receipts</span>
      </Link>
    </nav>
  );
}
