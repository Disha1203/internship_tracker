import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileText, Building2, Users, MessageSquare, Mail, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import React from 'react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/job-offers', label: 'Job Offers', icon: Briefcase },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/alumni', label: 'Alumni', icon: Users },
    { path: '/reviews', label: 'Reviews', icon: MessageSquare },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b-2 border-purple-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Placement Tracker
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-purple-50">
                  {currentUser.profilePicture ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-purple-300">
                      <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-green-400 to-blue-500">
                      <AvatarFallback className="text-white text-sm">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="hidden md:block text-sm text-gray-700">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default">
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm">{currentUser.name}</span>
                    <span className="text-xs text-gray-500">{currentUser.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700' : 'text-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
