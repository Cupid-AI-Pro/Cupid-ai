import { motion } from 'motion/react';
import { Heart, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isAI = message.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        delay: index * 0.1,
      }}
      className={`flex items-end gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {/* AI Avatar */}
      {isAI && (
        <motion.div
          className="relative flex-shrink-0"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.5)',
            }}
          >
            <Bot className="text-white" size={20} />
          </div>
          {/* Multiple glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-pink-400"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-rose-400"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
            }}
          />
        </motion.div>
      )}

      {/* Message bubble */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="group relative max-w-xl"
      >
        {isAI ? (
          // AI message - glossy white glass with pink glow
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 2px 8px rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Pink glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-transparent to-purple-200/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Floating sparkles on hover */}
            <motion.div
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
              animate={{
                y: [-5, -10, -5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles size={12} className="text-pink-400" />
            </motion.div>
            
            <p className="relative z-10 text-gray-800">{message.text}</p>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Border glow animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        ) : (
          // User message - 3D gradient pill with enhanced effects
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #c026d3 100%)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.5), 0 4px 16px rgba(244, 63, 94, 0.4)',
            }}
          >
            {/* Liquid-like animation overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'blur(20px)',
              }}
            />
            
            {/* Additional glow layer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-purple-400/30 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            
            <p className="relative z-10 text-white">{message.text}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 px-2 text-xs text-gray-500 ${isAI ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.div>

      {/* User heart indicator with enhanced animation */}
      {!isAI && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="relative flex-shrink-0"
        >
          <Heart size={24} className="fill-pink-400 text-pink-500 opacity-70" />
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.8],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Heart size={24} className="fill-pink-300 text-pink-400" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}