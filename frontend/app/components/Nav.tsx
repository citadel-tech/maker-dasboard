import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">
          <Link
            to="/"
            className="text-xl lg:text-3xl font-bold text-orange-500"
          >
            Coinswap Maker Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
