import { Link, useLocation } from 'react-router-dom';
import { CircleDollarSign, LayoutDashboard, FileText, Users, Handshake, GitBranch, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Frameworks', href: '/frameworks', icon: FileText },
  { name: 'Engagements', href: '/engagements', icon: Handshake },
  { name: 'Party Hub', href: '/parties', icon: Users },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <CircleDollarSign className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">Inovvio</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                location.pathname === item.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}