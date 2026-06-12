'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/runs', label: 'Runs', icon: '⊞' },
  { href: '/analytics', label: 'Analytics', icon: '⊟' },
  { href: '/triage', label: 'Triage', icon: '⚠' },
  { href: '/logs', label: 'Logs', icon: '☰' },
  { href: '/integrations', label: 'Integrations', icon: '⊕' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
  { href: '/maintainer', label: 'Maintainer', icon: '⚑' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center px-4 border-b" style={{ background: '#FFFFFF', borderColor: '#E0DFDC' }}>
      <Link href="/" className="flex items-center gap-2 mr-8 text-decoration-none">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0A66C2' }}>
          <span className="text-white font-bold text-sm">SC</span>
        </div>
        <span className="font-bold text-lg" style={{ color: '#191919', letterSpacing: '-0.01em' }}>
          CrashLab
        </span>
      </Link>

      <nav className="flex items-center h-full gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="top-nav-link"
              style={{
                color: isActive ? '#191919' : '#666666',
                borderBottomColor: isActive ? '#191919' : 'transparent',
              }}
            >
              <span className="top-nav-icon text-sm">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#EEF3F8' }}>
          <span className="text-xs" style={{ color: '#666666' }}>🔍</span>
          <span className="text-xs" style={{ color: '#86888A' }}>Search runs...</span>
        </div>
      </div>
    </header>
  );
}
