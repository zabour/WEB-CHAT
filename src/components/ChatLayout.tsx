import { useState } from 'react';
import ContactsSidebar from './ContactsSidebar';
import ChatArea from './ChatArea';

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'contact' | 'group' | null>(null);

  const handleSelectChat = (chatId: string, type: 'contact' | 'group') => {
    setSelectedChat(chatId);
    setChatType(type);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <ContactsSidebar 
        selectedChat={selectedChat} 
        onSelectChat={handleSelectChat}
      />
      <ChatArea 
        chatId={selectedChat} 
        chatType={chatType}
      />
    </div>
  );
}