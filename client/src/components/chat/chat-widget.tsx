import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2 
} from "lucide-react";

interface ChatMessage {
  type: 'user_message' | 'ai_message' | 'support_message';
  message: string;
  timestamp: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket();
    } else if (!isOpen && wsRef.current) {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isOpen]);

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log("Chat WebSocket connected");
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        console.log("Chat WebSocket disconnected");
      };
      
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: 'user_message',
      message: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(message));
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary-hover))] z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-80 shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-96'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[hsl(var(--kiratakip-primary))] text-white rounded-t-lg">
        <CardTitle className="text-sm font-semibold">
          KiraTakip AI Asistan
        </CardTitle>
        <div className="flex items-center gap-1">
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Çevrimiçi" : "Çevrimdışı"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    msg.type === 'user_message' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.type !== 'user_message' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[hsl(var(--kiratakip-primary))] text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-3 text-sm ${
                      msg.type === 'user_message'
                        ? 'bg-[hsl(var(--kiratakip-primary))] text-white'
                        : msg.type === 'ai_message'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  
                  {msg.type === 'user_message' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-500 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || !isConnected}
                size="icon"
                className="bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary-hover))]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <p className="text-xs text-gray-500 mt-2">
                Bağlantı kuruluyor...
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}