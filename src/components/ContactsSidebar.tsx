import { useState } from 'react';
import { Search, Users, MessageCircle, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { useSupabase } from '../hooks/useSupabase';
import { useNavigate } from 'react-router-dom';

interface ContactsSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string, type: 'contact' | 'group') => void;
}

export default function ContactsSidebar({ selectedChat, onSelectChat }: ContactsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const { user, profile, signOut } = useAuth();
  const { contacts, groups, loading } = useSupabase();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleSettings = () => {
    // For now, just show an alert. You can implement a settings modal later
    alert('Settings functionality coming soon!');
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSignOut} title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings} title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <Button
          variant={activeTab === 'chats' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('chats')}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chats
        </Button>
        <Button
          variant={activeTab === 'groups' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab('groups')}
        >
          <Users className="h-4 w-4 mr-2" />
          Groups
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <div className="divide-y divide-gray-100">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No chats yet</p>
                <p className="text-sm">Start a conversation to see your chats here</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChat === contact.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                  onClick={() => onSelectChat(contact.id, 'contact')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{contact.contact_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{contact.contact_name}</h3>
                        <span className="text-xs text-gray-500">Now</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">No messages yet</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="divide-y divide-gray-100">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No groups yet</p>
                <p className="text-sm">Create or join a group to see them here</p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChat === group.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                  onClick={() => onSelectChat(group.id, 'group')}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar_url} />
                      <AvatarFallback>{group.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                        <span className="text-xs text-gray-500">Now</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">No messages yet</p>
                      <p className="text-xs text-gray-500">0 members</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}