'use client';

import { useState } from 'react';
import { useAdminContacts } from '@/hooks/api/useAdmin';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useAdminContacts();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = contacts.filter(c => !c.read).length;

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminContacts] });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-neutral-900">Messages</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
        </p>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : contacts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-neutral-500">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card
              key={contact._id}
              className={`border-0 shadow-sm ${!contact.read ? 'bg-amber-50' : 'bg-white'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-neutral-600">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-neutral-900">{contact.name}</h3>
                        {!contact.read && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">New</Badge>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-500 mb-2">{contact.email}</p>

                    <p className={`text-sm text-neutral-600 ${expandedId !== contact._id ? 'line-clamp-2' : ''}`}>
                      {contact.message}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      {contact.message.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}
                          className="text-xs"
                        >
                          {expandedId === contact._id ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show more
                            </>
                          )}
                        </Button>
                      )}
                      {!contact.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(contact._id)}
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark as read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="h-3 w-3 mr-1" />
                          Reply
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
