import { motion } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

export function LoveParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    Icon: i % 3 === 0 ? Sparkles : Star,
    size: Math.random() * 12 + 8,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 15 + 20,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => {
        const Icon = particle.Icon;
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon
              size={particle.size}
              className="fill-pink-300/50 text-purple-400/50"
              style={{
                filter: 'blur(0.5px) drop-shadow(0 0 4px rgba(236, 72, 153, 0.5))',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
