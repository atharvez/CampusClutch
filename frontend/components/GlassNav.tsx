import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { NotificationBell } from './NotificationBell';

export default function GlassNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav font-manrope">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
              CampusClutch
            </Link>
          </motion.div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Explore', href: '/explore' },
              { name: 'Community', href: '/community' },
              { name: 'Requests', href: '/dashboard' },
              { name: 'Profile', href: '/profile' }
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <Link 
                  href={item.href} 
                  className="text-slate-500 hover:text-primary transition-colors duration-200 text-sm font-bold uppercase tracking-widest"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <NotificationBell />
          
          <div className="h-6 w-px bg-on-surface-variant/10 mx-1 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/profile" className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/10 transition-all hover:ring-primary/40 shadow-sm">
                <img 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                />
              </Link>
              <button 
                onClick={logout}
                className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="px-5 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
