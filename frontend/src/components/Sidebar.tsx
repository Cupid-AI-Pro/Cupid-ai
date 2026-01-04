import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Plus, User, Clock, Heart, Sparkles } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  time: string;
  hasHearts: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeChatId: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function Sidebar({
  isOpen,
  sessions,
  activeChatId,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative h-full w-80 flex-shrink-0"
        >
          <div
            className="relative h-full backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 via-transparent to-purple-200/20 pointer-events-none" />

            <div className="relative z-10 flex h-full flex-col p-6">
              {/* New Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewChat}
                className="group relative mb-8 flex items-center justify-center gap-3 rounded-2xl p-4 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                  boxShadow: '0 10px 40px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="fill-white text-white" size={20} />
                </motion.div>
                <span className="relative z-10 text-white">New Chat</span>
                <Plus className="relative z-10 text-white" size={20} />
              </motion.button>

              {/* Chat History */}
              <div className="mb-6 flex items-center gap-2 text-pink-900/70">
                <Clock size={18} />
                <span className="text-sm">Recent Conversations</span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {sessions.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                    className="group relative cursor-pointer rounded-xl p-4 backdrop-blur-xl"
                    style={{
                      background:
                        chat.id === activeChatId
                          ? 'rgba(236, 72, 153, 0.15)'
                          : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-300/0 to-purple-300/0 opacity-0 group-hover:from-pink-300/30 group-hover:to-purple-300/30 group-hover:opacity-100 transition-opacity"
                      style={{ filter: 'blur(8px)' }}
                    />

                    <div className="relative flex items-start gap-3">
                      <MessageCircle size={18} className="mt-1 flex-shrink-0 text-pink-600" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-gray-800">{chat.title}</p>
                        <p className="mt-1 text-xs text-gray-600">{chat.time}</p>
                      </div>
                      {chat.hasHearts && (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Heart size={14} className="flex-shrink-0 fill-pink-500 text-pink-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* User Profile Card (unchanged) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative mt-6 overflow-hidden rounded-2xl p-4 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%)',
                  boxShadow: '0 8px 24px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                }}
              >
                <motion.div
                  className="absolute -right-2 -top-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={20} className="text-pink-400" />
                </motion.div>

                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                        boxShadow: '0 4px 16px rgba(236, 72, 153, 0.5)',
                      }}
                    >
                      <User className="text-white" size={24} />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-800">Guest User</p>
                    <p className="text-xs text-pink-600">Premium Member</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
