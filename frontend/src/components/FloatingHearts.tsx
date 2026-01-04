import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 24 + 12,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 12,
    opacity: Math.random() * 0.4 + 0.1,
    rotationSpeed: Math.random() * 2 + 1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
          }}
          animate={{
            y: [0, -1200],
            x: [0, Math.sin(heart.id) * 150],
            rotate: [0, 360 * heart.rotationSpeed],
            opacity: [0, heart.opacity, heart.opacity, 0],
            scale: [0.5, 1, 0.8, 0.5],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Heart
              size={heart.size}
              className="fill-pink-400/60 text-pink-500/80"
              style={{
                filter: 'blur(1px) drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))',
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}