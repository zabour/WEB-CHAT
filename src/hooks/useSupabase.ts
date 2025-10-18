import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Contact {
  id: string;
  contact_user_id: string;
  contact_name: string;
  user_id: string;
  created_at: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  chat_id: string;
  chat_type: string;
  content: string;
  message_type: string;
  file_url: string;
  sender_id: string;
  created_at: string;
  updated_at: string;
}

export const useSupabase = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch contacts
  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_contacts')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    }
  };

  // Fetch groups
  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_group_members')
        .select(`
          group_id,
          app_227ebbfd7d_groups (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      const groupsData = data?.map(item => item.app_227ebbfd7d_groups).filter(Boolean) || [];
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  };

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId: string, chatType: 'contact' | 'group') => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_messages')
        .select('*')
        .eq('chat_id', chatId)
        .eq('chat_type', chatType)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  // Send a message
  const sendMessage = async (
    chatId: string,
    chatType: 'contact' | 'group',
    content: string,
    messageType: string = 'text'
  ) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_messages')
        .insert([
          {
            chat_id: chatId,
            chat_type: chatType,
            content,
            message_type: messageType,
            sender_id: user.id,
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: error instanceof Error ? error.message : 'Failed to send message' };
    }
  };

  // Add a contact
  const addContact = async (contactUserId: string, contactName: string) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const { data, error } = await supabase
        .from('app_227ebbfd7d_contacts')
        .insert([
          {
            user_id: user.id,
            contact_user_id: contactUserId,
            contact_name: contactName,
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      await fetchContacts(); // Refresh contacts
      return { data };
    } catch (error) {
      console.error('Error adding contact:', error);
      return { error: error instanceof Error ? error.message : 'Failed to add contact' };
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchContacts(), fetchGroups()]).finally(() => {
        setLoading(false);
      });
    } else {
      setContacts([]);
      setGroups([]);
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  return {
    contacts,
    groups,
    messages,
    loading,
    fetchContacts,
    fetchGroups,
    fetchMessages,
    sendMessage,
    addContact,
  };
};