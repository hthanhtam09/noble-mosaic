'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const sampleContacts: Contact[] = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    message: 'Hello, I wanted to ask about wholesale pricing for your coloring books. We run a local bookstore and would love to carry your products. Can you provide more information about bulk orders?',
    read: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'I love your mosaic coloring books! Do you have any plans to release a holiday-themed collection? My coloring group would be very interested.',
    read: true,
    createdAt: '2024-01-14T15:45:00Z',
  },
  {
    _id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    message: 'I received my order from Amazon yesterday and there was a small printing error on page 45. How can I get a replacement?',
    read: false,
    createdAt: '2024-01-13T09:20:00Z',
  },
  {
    _id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    message: 'Just wanted to say how much I enjoy your books! They have helped me manage my anxiety. Thank you for creating such beautiful designs.',
    read: true,
    createdAt: '2024-01-12T14:10:00Z',
  },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = contacts.filter(c => !c.read).length;

  const markAsRead = (id: string) => {
    setContacts(contacts.map(c => 
      c._id === id ? { ...c, read: true } : c
    ));
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
    </div>
  );
}
