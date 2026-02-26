import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '@/context/useRole';
import {
  LayoutDashboard, Users, Pill, ClipboardList,
  Activity, Bell, X, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { isFamily } = useRole();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), show: true },
    { to: '/patients',  icon: Users,           label: t('nav.patients'),  show: true },
    { to: '/vital-signs', icon: Activity,      label: t('nav.vitalSigns'),show: true },
    { to: '/medications', icon: Pill,          label: t('nav.medications'),show: !isFamily },
    { to: '/care-plans',  icon: ClipboardList, label: t('nav.carePlans'), show: true },
    { to: '/alerts',      icon: Bell,          label: t('nav.alerts'),    show: !isFamily },
  ];

  return (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-30 w-64 bg-[#1e3a5f] text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm leading-tight">
            Geriatric<br />Home Care
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.filter(i => i.show).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-xs text-white/40">Sprint 9 — v0.1.0</p>
      </div>
    </aside>
  );
}
