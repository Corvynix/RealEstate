import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AICloserPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem('ai_closer_session_id');
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { trackInteraction } = useBehaviorTracking({ page: '/ai-closer' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data: session } = useQuery({
    queryKey: ['/api/ai-closer/session', sessionId],
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (session?.sessionHistory) {
      setMessages(session.sessionHistory as Message[]);
    }
  }, [session]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!sessionId) {
        const response = await apiRequest('POST', '/api/ai-closer/start', { message });
        return await response.json();
      } else {
        const response = await apiRequest('POST', `/api/ai-closer/${sessionId}/message`, { message });
        return await response.json();
      }
    },
    onSuccess: (data: any) => {
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('ai_closer_session_id', data.sessionId);
      }
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(prev => [...prev, ...data.messages]);
      }
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="flex flex-col h-[calc(100vh-12rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>{t('aiCloser.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('aiCloser.subtitle')}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('aiCloser.startChat')}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t('nav.home') === 'Home' 
                    ? 'Start a conversation to find properties that match your needs. Tell me about your budget, preferred location, and what you\'re looking for.'
                    : 'ابدأ محادثة للعثور على العقارات التي تناسب احتياجاتك. أخبرني عن ميزانيتك والموقع المفضل وما تبحث عنه.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${index}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent/10">
                        <Bot className="h-4 w-4 text-accent" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-info text-info-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent/10">
                      <Bot className="h-4 w-4 text-accent" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('aiCloser.placeholder')}
              disabled={sendMessageMutation.isPending}
              data-testid="input-chat"
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending}
              data-testid="button-send"
              className="hover-elevate active-elevate-2 gap-2"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t('aiCloser.send')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
