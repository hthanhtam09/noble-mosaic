'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Download, Search, Calendar, Loader2, Users, FileText } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  source: string;
  downloadedPages: string[];
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: async () => {
      const response = await fetch('/api/subscribers');
      const data = await response.json();
      
      if (response.ok) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const thisWeek = (data.subscribers || []).filter((s: Subscriber) => 
          new Date(s.createdAt) >= weekAgo
        ).length;
        
        const thisMonth = (data.subscribers || []).filter((s: Subscriber) => 
          new Date(s.createdAt) >= monthAgo
        ).length;
        
        return {
          subscribers: data.subscribers || [],
          stats: {
            total: data.subscribers?.length || 0,
            thisWeek,
            thisMonth,
          }
        };
      }
      return { subscribers: [], stats: { total: 0, thisWeek: 0, thisMonth: 0 } };
    }
  });

  const subscribers = data?.subscribers || [];
  const stats = data?.stats || {
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
  };
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Source', 'Downloads', 'Date Subscribed'].join(','),
      ...subscribers.map(s => [
        s.email,
        s.source,
        s.downloadedPages.length.toString(),
        new Date(s.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Email Subscribers</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your email list</p>
        </div>
        <Button 
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Subscribers</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">This Week</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">This Month</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.thisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Subscribers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No subscribers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-neutral-500" />
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {subscriber.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <FileText className="h-4 w-4" />
                      {subscriber.downloadedPages.length} pages
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
