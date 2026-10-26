import { Home, Shirt, Calendar, Heart, Plus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/wardrobe', icon: Shirt, label: 'Closet' },
  { to: '/add', icon: Plus, label: 'Add', center: true },
  { to: '/planner', icon: Calendar, label: 'Plan' },
  { to: '/favorites', icon: Heart, label: 'Vault' }
];

export function FloatingDock() {
  const navigate = useNavigate();
  return (
    <nav className="absolute bottom-4 inset-x-5 h-16 rounded-full bg-white/90 backdrop-blur border border-[#EBE5DF] shadow-lg flex items-center justify-around px-2 z-30">
      {items.map((item) =>
        item.center ? (
          <button
            key={item.to}
            type="button"
            onClick={() => navigate('/add')}
            className="-mt-8 w-14 h-14 rounded-full bg-charcoal text-white flex items-center justify-center shadow-xl"
            aria-label="Add clothes"
          >
            <Plus size={22} />
          </button>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex flex-col items-center text-[10px] font-semibold ${isActive ? 'text-charcoal' : 'text-stone-400'}`}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
}
