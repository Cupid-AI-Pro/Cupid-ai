import { motion } from 'motion/react';
import { Mic, Paperclip, CreditCard, Film, Settings } from 'lucide-react';

export function FloatingToolbar() {
  const tools = [
    { icon: Mic, label: 'Voice Mode', color: 'from-pink-500 to-rose-500' },
    { icon: Paperclip, label: 'Upload', color: 'from-purple-500 to-pink-500' },
    { icon: CreditCard, label: 'Payment', color: 'from-rose-500 to-red-500' },
    { icon: Film, label: 'Matches', color: 'from-pink-500 to-purple-500' },
    { icon: Settings, label: 'Settings', color: 'from-purple-500 to-rose-500' },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 }}
      className="relative z-20 flex flex-col items-center gap-4 p-6"
    >
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        return (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, x: 50, scale: 0 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: 0.7 + index * 0.1,
              type: 'spring',
              damping: 15,
            }}
            whileHover={{
              scale: 1.15,
              rotate: 5,
            }}
            whileTap={{ scale: 0.9 }}
            className="group relative"
          >
            {/* Tooltip */}
            <motion.div
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="text-sm text-gray-800">{tool.label}</span>
              <div
                className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rotate-45"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              />
            </motion.div>

            {/* Icon container */}
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${tool.color.split(' ')[1]} 0%, ${tool.color.split(' ')[3]} 100%)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{
                  scale: [0, 1.5],
                  opacity: [0.8, 0],
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Icon */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.2 }}
              >
                <Icon size={24} className="text-pink-600" />
              </motion.div>

              {/* Hover glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 blur-xl group-hover:opacity-50 transition-opacity`}
                style={{ zIndex: -1 }}
              />
            </div>
          </motion.button>
        );
      })}

      {/* Floating connector line */}
      <div
        className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.2), transparent)',
        }}
      />
    </motion.div>
  );
}
