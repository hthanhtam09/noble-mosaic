'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Home, BookOpen, FileText, MessageSquare, LogOut, Menu, X, 
  Users, ShoppingBag, Settings, Lock, Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Secrets', href: '/admin/secrets', icon: Lock },
  { name: 'Gift Links', href: '/admin/gift-links', icon: Gift },
  { name: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { name: 'Messages', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface UserData {
  username: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/admin/login') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth');
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
          setUser(data.user || null);
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchProductCount = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProductCount(data.products?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch product count:', error);
      }
    };
    
    fetchProductCount();
  }, [isAuthenticated, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mx-auto mb-4" />
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Noble Mosaic"
              width={44}
              height={44}
              unoptimized
              className="h-11 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-neutral-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.name === 'Products' && productCount !== null && (
                  <span className="ml-auto bg-neutral-200 text-neutral-600 text-xs px-2 py-0.5 rounded-full">{productCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-neutral-200 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-neutral-500 hover:text-neutral-700 mr-4"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="text-neutral-500 hover:text-neutral-700">Admin</Link>
            {pathname !== '/admin' && (
              <>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-900 font-medium">
                  {navigation.find(n => pathname.startsWith(n.href) && n.href !== '/admin')?.name || 'Dashboard'}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank" className="flex items-center gap-2">
                <span className="hidden sm:inline">View Site</span>
                <X className="h-4 w-4 sm:hidden" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
