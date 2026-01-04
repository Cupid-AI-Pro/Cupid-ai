import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Paperclip, Heart, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSendMessage: (text: string) => void;
}

export function InputSection({ onSendMessage }: InputSectionProps) {
  const [message, setMessage] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [heartParticles, setHeartParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [recognition, setRecognition] = useState<any>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Burst heart particles
      const particles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
      }));
      setHeartParticles(particles);
      
      // Clear particles after animation
      setTimeout(() => setHeartParticles([]), 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
    

useEffect(() => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported");
    return;
  }

  const recog = new SpeechRecognition();
  recog.continuous = false;
  recog.interimResults = false;
  recog.lang = "en-IN";

  recog.onresult = (event: any) => {
    const transcript = event.results?.[0]?.[0]?.transcript;
    if (transcript) {
      setMessage((prev) => (prev ? prev + " " + transcript : transcript));
    }
    setIsVoiceActive(false);
  };

  recog.onerror = () => setIsVoiceActive(false);
  recog.onend = () => setIsVoiceActive(false);

  setRecognition(recog);

  return () => {
    try {
      recog.stop();
    } catch {}
  };
}, []);

  return (
    <div className="relative z-20 p-6">
      {/* Heart particle burst with sparkles */}
      <AnimatePresence>
        {heartParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="pointer-events-none absolute left-1/2 top-0"
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 1.5, 0.5],
              x: particle.x,
              y: particle.y,
              rotate: Math.random() * 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {particle.id % 3 === 0 ? (
              <Sparkles size={16} className="fill-purple-400 text-purple-500" />
            ) : (
              <Heart size={18} className="fill-pink-400 text-pink-500" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative"
        >
          {/* 3D Input container */}
          <div
            className="relative overflow-hidden rounded-3xl backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              boxShadow: '0 12px 48px rgba(236, 72, 153, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 2px 12px rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* Inner glow with animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-100/40 via-purple-100/30 to-rose-100/40 pointer-events-none"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.4), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative flex items-end gap-3 p-4">
              {/* Voice button with enhanced effects */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!recognition) return;
                  setIsVoiceActive(true);
                  recognition.start();
                  }}

                className="relative flex-shrink-0 rounded-xl p-3"
                style={{
                  background: isVoiceActive
                    ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
                    : 'rgba(236, 72, 153, 0.1)',
                  boxShadow: isVoiceActive
                    ? '0 4px 20px rgba(236, 72, 153, 0.5)'
                    : 'none',
                }}
              >
                {isVoiceActive && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-pink-400"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-rose-400"
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.3, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                  </>
                )}
                <motion.div
                  animate={isVoiceActive ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isVoiceActive ? Infinity : 0,
                  }}
                >
                  <Mic
                    size={20}
                    className={isVoiceActive ? 'relative z-10 text-white' : 'text-pink-600'}
                  />
                </motion.div>
              </motion.button>

              {/* Text input */}
              <div className="relative flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message to Cupid AI..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 py-3 text-gray-800 placeholder-gray-400 outline-none"
                  style={{
                    minHeight: '44px',
                    maxHeight: '120px',
                  }}
                />
                {message && (
                  <motion.div
                    className="absolute -right-2 -top-2"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles size={12} className="text-pink-400" />
                  </motion.div>
                )}
              </div>

              {/* Paperclip button with enhanced animation */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9, rotate: -15 }}
                className="relative flex-shrink-0 rounded-xl p-3 transition-colors hover:bg-pink-100/60"
              >
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-200/0 to-purple-200/0"
                  whileHover={{
                    background: 'linear-gradient(to right, rgba(251, 207, 232, 0.3), rgba(233, 213, 255, 0.3))',
                  }}
                />
                <Paperclip size={20} className="relative z-10 text-pink-600" />
              </motion.button>

              {/* Send button - enhanced 3D heart with launch animation */}
              <motion.button
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!message.trim()}
                className="relative flex-shrink-0 overflow-hidden rounded-xl p-3 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  boxShadow: '0 8px 24px rgba(236, 72, 153, 0.5), 0 4px 12px rgba(244, 63, 94, 0.3)',
                }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, opacity: 0.5 }}
                  whileTap={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <Send size={20} className="relative z-10 text-white" />
                </motion.div>
                
                {/* Outer glow pulse */}
                {message.trim() && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-pink-400"
                    animate={{
                      scale: [1, 1.3],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          {/* Bottom hint text with animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center text-xs text-gray-500"
          >
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Press Enter to send, Shift + Enter for new line
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
