'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag, FileText, MessageSquare, Users,
  ArrowUpRight, ArrowRight, Mail, Eye, Clock, Download, Gift, Loader2
} from 'lucide-react';
import {
  useAdminProducts,
  useAdminBlogPosts,
  useAdminSubscribers,
  useAdminContacts,
  useAdminGiftLinks
} from '@/hooks/api/useAdmin';

interface Stats {
  products: number;
  blogPosts: number;
  subscribers: number;
  messages: number;
  unreadMessages: number;
  newSubscribersThisWeek: number;
  giftLinks: number;
}

interface RecentActivity {
  id: string;
  type: 'subscriber' | 'message' | 'product';
  title: string;
  description: string;
  time: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AdminDashboard() {
  const { data: products = [], isLoading: isLoadingProd } = useAdminProducts();
  const { data: blogPosts = [], isLoading: isLoadingBlog } = useAdminBlogPosts();
  const { data: subscribers = [], isLoading: isLoadingSub } = useAdminSubscribers();
  const { data: contacts = [], isLoading: isLoadingMsg } = useAdminContacts();
  const { data: giftLinks = [], isLoading: isLoadingGift } = useAdminGiftLinks();

  const isLoading = isLoadingProd || isLoadingBlog || isLoadingSub || isLoadingMsg || isLoadingGift;

  const dashboardData = useMemo(() => {
    const stats: Stats = {
      products: (products as any[]).length,
      blogPosts: (blogPosts as any[]).length,
      subscribers: (subscribers as any[]).length,
      messages: (contacts as any[]).length,
      unreadMessages: (contacts as any[]).filter((c: any) => !c.read).length,
      newSubscribersThisWeek: 0,
      giftLinks: (giftLinks as any[]).length,
    };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    stats.newSubscribersThisWeek = (subscribers as any[]).filter((s: any) =>
      new Date(s.createdAt) >= weekAgo
    ).length;

    const activity: RecentActivity[] = [];

    // Add recent products
    (products as any[]).slice(0, 2).forEach((p: any) => {
      activity.push({
        id: `prod-${p._id}`,
        type: 'product',
        title: 'Product added',
        description: p.title,
        time: timeAgo(p.createdAt),
      });
    });

    // Add recent subscribers
    (subscribers as any[]).slice(0, 2).forEach((s: any) => {
      activity.push({
        id: `sub-${s._id}`,
        type: 'subscriber',
        title: 'New subscriber',
        description: `${s.email} joined via ${s.source || 'website'}`,
        time: timeAgo(s.createdAt),
      });
    });

    // Add recent messages
    (contacts as any[]).slice(0, 2).forEach((c: any) => {
      activity.push({
        id: `msg-${c._id}`,
        type: 'message',
        title: `Message from ${c.name}`,
        description: `From: ${c.email}`,
        time: timeAgo(c.createdAt),
      });
    });

    return {
      stats,
      recentActivity: activity.sort((a, b) => 0).slice(0, 6)
    };
  }, [products, blogPosts, subscribers, contacts, giftLinks]);

  const stats = dashboardData?.stats || {
    products: 0,
    blogPosts: 0,
    subscribers: 0,
    messages: 0,
    unreadMessages: 0,
    newSubscribersThisWeek: 0,
    giftLinks: 0,
  };
  const recentActivity = (dashboardData?.recentActivity || []).map((item: any) => ({
    ...item
  }));

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/products',
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
    },
    {
      title: 'Gift Links',
      value: stats.giftLinks,
      icon: Gift,
      color: 'bg-pink-100 text-pink-600',
      href: '/admin/gift-links',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'bg-amber-100 text-amber-600',
      href: '/admin/contacts',
      change: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined,
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
      name: 'Gift Links',
      href: '/admin/gift-links',
      icon: Gift,
      description: 'Manage gift download links',
      color: 'bg-pink-600 hover:bg-pink-700 text-white',
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
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
          <span className="text-sm text-neutral-500">
            {isLoading ? 'Loading...' : 'Last updated: just now'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs mt-2 flex items-center gap-1 ${stat.changePositive ? 'text-green-600' : 'text-amber-600'
                        }`}>
                        {stat.changePositive ? <ArrowUpRight className="h-3 w-3" /> : null}
                        {stat.change}
                      </p>
                    )}
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
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-8">No activity yet.</p>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 py-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'subscriber' ? 'bg-green-100' :
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
              )}
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
            Collect emails through the gift page. Users subscribe to access the gift.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/gift" target="_blank">
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
