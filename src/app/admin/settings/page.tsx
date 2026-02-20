'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, Globe, Mail, Shield, Database, 
  ImageIcon, Save, RefreshCw, ExternalLink, Check
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-500 text-sm mt-1">Configure your store settings</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2 text-green-400" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Store Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-neutral-500" />
            <CardTitle className="text-base">Store Information</CardTitle>
          </div>
          <CardDescription>Basic store configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="Noble Mosaic" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input id="storeEmail" type="email" defaultValue="hello@noblemosaic.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Input 
              id="storeDescription" 
              defaultValue="Premium Mosaic Color By Number Books for mindful relaxation" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-neutral-500" />
            <CardTitle className="text-base">Integrations</CardTitle>
          </div>
          <CardDescription>Connected services and APIs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MongoDB */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">MongoDB</p>
                <p className="text-xs text-neutral-500">Database connection</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Connected</Badge>
          </div>

          {/* Cloudinary */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Cloudinary</p>
                <p className="text-xs text-neutral-500">Image storage & CDN</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Connected</Badge>
          </div>

          {/* Amazon */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Amazon Affiliate</p>
                <p className="text-xs text-neutral-500">Product links redirect to Amazon</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-neutral-500" />
            <CardTitle className="text-base">Email Collection</CardTitle>
          </div>
          <CardDescription>Free downloads and newsletter settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Free Downloads Page</p>
              <p className="text-sm text-neutral-500">Collect emails via free coloring pages</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Newsletter Signup</p>
              <p className="text-sm text-neutral-500">Footer newsletter form</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <Button variant="outline" asChild>
              <a href="/free-downloads" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Free Downloads Page
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-neutral-500" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>Admin access and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminUsername">Admin Username</Label>
            <Input id="adminUsername" defaultValue="shin" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">Admin Password</Label>
            <div className="flex gap-2">
              <Input 
                id="adminPassword" 
                type="password" 
                value="••••••" 
                disabled 
                className="flex-1" 
              />
              <Button variant="outline">Change</Button>
            </div>
            <p className="text-xs text-neutral-500">
              Password can be changed in the .env.local file
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-base text-red-700">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Clear All Subscribers</p>
              <p className="text-sm text-neutral-500">Delete all collected emails</p>
            </div>
            <Button variant="destructive" size="sm">
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Reset Database</p>
              <p className="text-sm text-neutral-500">Delete all products and blog posts</p>
            </div>
            <Button variant="destructive" size="sm">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
