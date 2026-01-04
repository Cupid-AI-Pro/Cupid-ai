import { motion } from 'motion/react';
import { Heart, FileText, Lightbulb, Film, Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  onSuggestionClick: (text: string) => void;
}

export function SuggestionChips({ onSuggestionClick }: SuggestionChipsProps) {
  const suggestions = [
    { text: 'Find Matches 💘', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { text: 'Register Me 📝', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { text: 'Show Plans 💡', icon: Lightbulb, color: 'from-rose-500 to-orange-400' },
    { text: 'View Gallery 🎞️', icon: Film, color: 'from-fuchsia-500 to-purple-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative z-10 px-6 pb-4"
    >
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4 text-center text-sm text-gray-600"
        >
          Quick actions to get started:
        </motion.p>

        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={suggestion.text}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.1,
                  type: 'spring',
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -8,
                  rotateZ: index % 2 === 0 ? 3 : -3,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="group relative overflow-hidden rounded-2xl px-6 py-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                  boxShadow: '0 4px 16px rgba(236, 72, 153, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Multiple glow rings on hover */}
                <motion.div
                  className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${suggestion.color} opacity-0 blur-xl group-hover:opacity-60 transition-opacity`}
                  style={{
                    zIndex: -1,
                  }}
                />
                <motion.div
                  className={`absolute -inset-2 rounded-2xl bg-gradient-to-r ${suggestion.color} opacity-0 blur-2xl group-hover:opacity-30 transition-opacity`}
                  style={{
                    zIndex: -2,
                  }}
                />

                {/* Magnetic pull animation background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-pink-200/0 to-purple-200/0 group-hover:from-pink-200/50 group-hover:to-purple-200/50 transition-all"
                  style={{
                    filter: 'blur(10px)',
                  }}
                />
                
                {/* Floating sparkle on hover */}
                <motion.div
                  className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles size={14} className="text-pink-400" />
                </motion.div>

                <div className="relative flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon size={16} className="text-pink-600" />
                  </motion.div>
                  <span className="text-sm text-gray-800">{suggestion.text}</span>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{
                    x: '100%',
                    transition: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />
                
                {/* Particle burst on hover */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, (Math.random() - 0.5) * 40],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}