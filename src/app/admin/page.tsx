'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, FileText, MessageSquare, Users, TrendingUp, 
  ArrowUpRight, ArrowRight, Mail, Eye, Clock, Download
} from 'lucide-react';

interface Stats {
  products: number;
  blogPosts: number;
  subscribers: number;
  messages: number;
  unreadMessages: number;
  newSubscribersThisWeek: number;
}

interface RecentActivity {
  id: string;
  type: 'subscriber' | 'message' | 'product';
  title: string;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 4,
    blogPosts: 6,
    subscribers: 0,
    messages: 12,
    unreadMessages: 3,
    newSubscribersThisWeek: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'subscriber',
      title: 'New subscriber',
      description: 'john@example.com joined via Free Downloads',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'message',
      title: 'New message received',
      description: 'From: sarah@example.com',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'product',
      title: 'Product added',
      description: 'Mosaic Animals Color By Number',
      time: '1 day ago',
    },
    {
      id: '4',
      type: 'subscriber',
      title: 'New subscriber',
      description: 'mike@example.com joined via Newsletter',
      time: '1 day ago',
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch subscribers
        const subResponse = await fetch('/api/subscribers');
        if (subResponse.ok) {
          const subData = await subResponse.json();
          const total = subData.subscribers?.length || 0;
          
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const thisWeek = (subData.subscribers || []).filter((s: { createdAt: string }) => 
            new Date(s.createdAt) >= weekAgo
          ).length;
          
          setStats(prev => ({
            ...prev,
            subscribers: total,
            newSubscribersThisWeek: thisWeek,
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/products',
      change: '+2 this month',
      changePositive: true,
    },
    {
      title: 'Subscribers',
      value: stats.subscribers,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      href: '/admin/subscribers',
      change: `+${stats.newSubscribersThisWeek} this week`,
      changePositive: true,
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      href: '/admin/blog',
      change: '4 published',
      changePositive: true,
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'bg-amber-100 text-amber-600',
      href: '/admin/contacts',
      change: `${stats.unreadMessages} unread`,
      changePositive: false,
    },
  ];

  const quickActions = [
    {
      name: 'Add Product',
      href: '/admin/products/new',
      icon: ShoppingBag,
      description: 'Add a new coloring book',
      color: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    },
    {
      name: 'View Subscribers',
      href: '/admin/subscribers',
      icon: Users,
      description: 'Export email list',
      color: 'bg-green-600 hover:bg-green-700 text-white',
    },
    {
      name: 'Write Blog Post',
      href: '/admin/blog',
      icon: FileText,
      description: 'Create new content',
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Welcome back! Here's your store overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Last updated: just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      stat.changePositive ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {stat.changePositive ? <ArrowUpRight className="h-3 w-3" /> : null}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-5">
              <h2 className="font-semibold text-neutral-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.name} href={action.href}>
                    <Button 
                      className={`w-full justify-start h-auto py-3 px-4 ${action.color}`}
                    >
                      <action.icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.name}</div>
                        <div className="text-xs opacity-80">{action.description}</div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-neutral-500">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="divide-y divide-neutral-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 py-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'subscriber' ? 'bg-green-100' :
                      activity.type === 'message' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'subscriber' && <Users className="h-4 w-4 text-green-600" />}
                      {activity.type === 'message' && <Mail className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'product' && <ShoppingBag className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email List Preview */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-neutral-500" />
              <h2 className="font-semibold text-neutral-900">Email Subscribers</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">{stats.subscribers} total</Badge>
            </div>
            <Link href="/admin/subscribers">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </Link>
          </div>
          <p className="text-sm text-neutral-500">
            Collect emails through free downloads page. Users subscribe to access free coloring pages.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/free-downloads" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Page
              </Button>
            </Link>
            <Link href="/admin/subscribers">
              <Button variant="outline" size="sm">
                Manage Subscribers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
