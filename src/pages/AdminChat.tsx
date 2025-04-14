import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Paperclip, Mic, Smile } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for a support worker
const mockSupportWorker = {
  _id: "sw1",
  firstName: "Olivia",
  lastName: "Thompson",
  email: "olivia.thompson@example.com.au",
  profileImage: "https://i.pravatar.cc/150?img=5",
  role: "support-worker"
};

// Mock conversation
const mockMessages = [
  {
    id: "1",
    sender: "admin",
    content: "Hi Olivia, I wanted to let you know there's a new connection request for you.",
    timestamp: new Date("2025-04-09T10:30:00").toISOString(),
  },
  {
    id: "2",
    sender: "support-worker",
    content: "Thanks for letting me know! Is this the one from John Smith?",
    timestamp: new Date("2025-04-09T10:32:00").toISOString(),
  },
  {
    id: "3",
    sender: "admin",
    content: "Yes, that's correct. John is looking for support with daily activities.",
    timestamp: new Date("2025-04-09T10:35:00").toISOString(),
  },
  {
    id: "4",
    sender: "support-worker",
    content: "Great! I'll take a look at the details and respond to the invitation soon.",
    timestamp: new Date("2025-04-09T10:40:00").toISOString(),
  },
];

export default function AdminChat() {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  
  // For demo purposes, we're using the mock data
  // In a real app, you would fetch the support worker and messages based on workerId
  const supportWorker = mockSupportWorker;
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: `${messages.length + 1}`,
      sender: "admin",
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
    
    // Simulate response (remove in production)
    setTimeout(() => {
      const responseMessage = {
        id: `${messages.length + 2}`,
        sender: "support-worker",
        content: "Thanks for the update! I'll check it out.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6 gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Chat with Support Worker</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar with user info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Support Worker</CardTitle>
              <CardDescription>Contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={supportWorker.profileImage} alt={`${supportWorker.firstName} ${supportWorker.lastName}`} />
                  <AvatarFallback>{supportWorker.firstName.charAt(0)}{supportWorker.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-medium">{supportWorker.firstName} {supportWorker.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{supportWorker.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat interface */}
        <div className="md:col-span-3">
          <Card className="flex flex-col h-[700px]">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={supportWorker.profileImage} alt={`${supportWorker.firstName} ${supportWorker.lastName}`} />
                  <AvatarFallback>{supportWorker.firstName.charAt(0)}{supportWorker.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{supportWorker.firstName} {supportWorker.lastName}</CardTitle>
                  <CardDescription>Active now</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex gap-2 items-end max-w-[70%]">
                    {message.sender !== 'admin' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={supportWorker.profileImage} />
                        <AvatarFallback>{supportWorker.firstName.charAt(0)}{supportWorker.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg p-3 ${
                        message.sender === 'admin' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`text-xs mt-1 ${message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                    {message.sender === 'admin' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex items-center w-full gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type a message..."
                  className="flex-1 h-10 py-2"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  variant="default"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}