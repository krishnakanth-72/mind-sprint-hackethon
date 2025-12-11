import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Package, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: Package, text: "What's my current stock level for Paracetamol?" },
  { icon: Clock, text: "Which products are expiring soon?" },
  { icon: TrendingUp, text: "What are the AI reorder suggestions?" },
];

const mockResponses: Record<string, string> = {
  'stock': `**Current Stock Summary:**\n\n• Paracetamol 500mg: 450 units (2 batches)\n• Amoxicillin 250mg: 85 units ⚠️ *Low stock*\n• Omeprazole 20mg: 320 units\n• Ibuprofen 400mg: 45 units ⚠️ *Critical*\n• Metformin 500mg: 580 units\n• Aspirin 100mg: 25 units ⚠️ *Critical*\n\n**Action Required:** 3 products need immediate reorder.`,
  'expir': `**Expiring Products (FEFO Order):**\n\n🔴 **Expired:**\n• Aspirin 100mg (Batch BT2024009) - Expired Feb 28, 2024\n\n🟡 **Expiring within 30 days:**\n• Paracetamol 500mg (Batch BT2024001) - Mar 15, 2024\n• Ibuprofen 400mg (Batch BT2024006) - Apr 10, 2024\n\n**Recommendation:** Prioritize dispensing these batches first following FEFO protocol.`,
  'reorder': `**AI Reorder Recommendations:**\n\nBased on demand forecasting and current stock levels:\n\n1. **Aspirin 100mg** - Order 300 units\n   • Current: 25 | Reorder Level: 150\n   • Predicted weekly demand: 45 units\n\n2. **Ibuprofen 400mg** - Order 200 units\n   • Current: 45 | Reorder Level: 100\n   • Predicted weekly demand: 35 units\n\n3. **Amoxicillin 250mg** - Order 150 units\n   • Current: 85 | Reorder Level: 100\n   • Predicted weekly demand: 28 units\n\n💡 *Confidence: 92% based on historical data*`,
  'default': `I'm your AI pharmacy assistant! I can help you with:\n\n• **Stock queries** - Check current inventory levels\n• **Expiry tracking** - View products expiring soon\n• **Reorder suggestions** - AI-powered recommendations\n• **Sales analysis** - Historical trends and forecasts\n\nWhat would you like to know?`
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI pharmacy inventory assistant. I can help you with stock queries, expiry tracking, and AI-powered reorder suggestions. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('stock') || lowerQuery.includes('inventory') || lowerQuery.includes('paracetamol')) {
      return mockResponses.stock;
    }
    if (lowerQuery.includes('expir') || lowerQuery.includes('fefo') || lowerQuery.includes('soon')) {
      return mockResponses.expir;
    }
    if (lowerQuery.includes('reorder') || lowerQuery.includes('suggest') || lowerQuery.includes('ai') || lowerQuery.includes('recommend')) {
      return mockResponses.reorder;
    }
    return mockResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Ask about inventory, expiry dates, and AI recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-slide-up",
                    message.role === 'user' && "flex-row-reverse"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'assistant' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'assistant' 
                      ? "bg-secondary text-secondary-foreground" 
                      : "bg-primary text-primary-foreground"
                  )}>
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <p className={cn(
                      "text-xs mt-2 opacity-70",
                      message.role === 'user' && "text-right"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about stock, expiry dates, reorder suggestions..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  className="gradient-primary text-primary-foreground shadow-glow"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleQuickQuestion(q.text)}
                >
                  <q.icon className="w-4 h-4 mr-3 flex-shrink-0 text-primary" />
                  <span className="text-sm">{q.text}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">AI-Powered</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This assistant uses machine learning to provide accurate inventory insights and predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
