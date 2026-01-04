import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Parallax background with floating hearts - subtle overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-rose-50/50"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundSize: '400% 400%',
          }}
        />
      </div>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-pink-200/50"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
            />
          ))}

          {isTyping && <TypingIndicator />}
        </div>
      </div>
    </div>
  );
}
