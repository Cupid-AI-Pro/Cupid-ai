import { motion } from 'motion/react';
import { Heart, Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-3"
    >
      {/* AI Avatar */}
      <motion.div
        className="relative flex-shrink-0"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1,
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
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-pink-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Typing bubble with jumping hearts */}
      <div
        className="rounded-3xl px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              <Heart
                size={12}
                className="fill-pink-500 text-pink-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
