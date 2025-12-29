import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  CheckCheck, 
  Check,
  Shield,
  Clock,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "factory";
  senderName: string;
  timestamp: string;
  read: boolean;
  attachments?: { name: string; type: string }[];
}

interface Conversation {
  id: string;
  factoryName: string;
  factoryImage?: string;
  isVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  responseTime: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    factoryName: "Coastal Swim Manufacturing",
    isVerified: true,
    lastMessage: "Thank you for your inquiry. We can definitely help with your swimwear line...",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    responseTime: "< 2 hours"
  },
  {
    id: "2",
    factoryName: "EcoFashion Manufacturing",
    isVerified: true,
    lastMessage: "The samples are ready for shipping. Should we proceed?",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
    responseTime: "< 24 hours"
  },
  {
    id: "3",
    factoryName: "Premium Textiles Co.",
    isVerified: false,
    lastMessage: "We've reviewed your specifications and have some questions...",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    responseTime: "< 48 hours"
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi, I'm interested in producing a sustainable swimwear line. Do you work with recycled materials?",
    sender: "user",
    senderName: "You",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "2",
    content: "Hello! Thank you for reaching out. Yes, we specialize in sustainable swimwear production and work extensively with ECONYL® regenerated nylon and recycled polyester.",
    sender: "factory",
    senderName: "Maria Chen",
    timestamp: "10:45 AM",
    read: true,
  },
  {
    id: "3",
    content: "That sounds perfect! What's your typical MOQ for a new brand? We're looking at around 300-500 pieces per style.",
    sender: "user",
    senderName: "You",
    timestamp: "11:00 AM",
    read: true,
  },
  {
    id: "4",
    content: "For new partners, our MOQ starts at 200 pieces per style, so your quantity is well within range. We also offer a development package that includes tech packs, sampling, and production planning.",
    sender: "factory",
    senderName: "Maria Chen",
    timestamp: "11:15 AM",
    read: true,
    attachments: [
      { name: "Development_Package.pdf", type: "pdf" }
    ]
  },
  {
    id: "5",
    content: "I've attached our development package overview. Would you like to schedule a video call to discuss your project in detail?",
    sender: "factory",
    senderName: "Maria Chen",
    timestamp: "11:16 AM",
    read: false,
  },
];

interface PlatformMessagingProps {
  className?: string;
}

export function PlatformMessaging({ className }: PlatformMessagingProps) {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [message, setMessage] = useState("");
  const [messages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    // Mock send - in real app this would call API
    setMessage("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const selectedFactory = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden h-[600px] flex", className)}>
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Messages</h3>
          <p className="text-xs text-muted-foreground mt-1">
            All messages are encrypted and logged
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={cn(
                "w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border",
                selectedConversation === conv.id && "bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {conv.factoryName.charAt(0)}
                    </span>
                  </div>
                  {conv.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground truncate">
                      {conv.factoryName}
                    </span>
                    {conv.isVerified && (
                      <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground">
                    {conv.lastMessageTime}
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="mt-1 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {selectedFactory && (
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {selectedFactory.factoryName.charAt(0)}
                  </span>
                </div>
                {selectedFactory.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">
                    {selectedFactory.factoryName}
                  </span>
                  {selectedFactory.isVerified && (
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">
                      <Shield className="w-3 h-3 mr-0.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Avg. response: {selectedFactory.responseTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-3",
                  msg.sender === "user" && "flex-row-reverse"
                )}
              >
                {msg.sender === "factory" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {msg.senderName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5",
                  msg.sender === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-md" 
                    : "bg-muted rounded-bl-md"
                )}>
                  {msg.sender === "factory" && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {msg.senderName}
                      </span>
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <p className={cn(
                    "text-sm",
                    msg.sender === "user" ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {msg.content}
                  </p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((att, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-xs">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={cn(
                    "flex items-center gap-1 mt-1",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}>
                    <span className={cn(
                      "text-xs",
                      msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {msg.timestamp}
                    </span>
                    {msg.sender === "user" && (
                      msg.read 
                        ? <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />
                        : <Check className="w-3.5 h-3.5 text-primary-foreground/70" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">M</span>
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!message.trim()}
              className="shrink-0 rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            <Shield className="w-3 h-3 inline mr-1" />
            Messages are encrypted and monitored for your protection
          </p>
        </div>
      </div>
    </div>
  );
}
