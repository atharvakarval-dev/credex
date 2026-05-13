"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from 'next/navigation';
import { Home, Briefcase, Shield, Settings } from 'lucide-react';

export interface InteractiveMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
}

const defaultItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home, href: "/" },
    { label: 'audit', icon: Briefcase, href: "/audit" },
    { label: 'security', icon: Shield, href: "#" },
    { label: 'settings', icon: Settings, href: "#" },
];

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items }) => {
  const router = useRouter();
  const pathname = usePathname();

  const finalItems = useMemo(() => {
     return items && items.length >= 2 ? items : defaultItems;
  }, [items]);

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white/5 bg-black/60 p-1.5 backdrop-blur-3xl shadow-2xl"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {finalItems.map((item) => (
        <Tab 
          key={item.label} 
          setPosition={setPosition} 
          onClick={() => item.href && item.href !== "#" && router.push(item.href)}
          isActive={item.href === pathname}
        >
          <div className="flex items-center gap-2">
            <item.icon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{item.label}</span>
          </div>
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  onClick,
  isActive
}: {
  children: React.ReactNode;
  setPosition: any;
  onClick: () => void;
  isActive: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  // Set initial position based on active item if needed, but the requested implementation is hover-based
  // We'll stick to the requested implementation but add a subtle "active" state indicator if desired.
  
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300
        ${isActive ? 'text-[#E1E0CC]' : 'text-[#E1E0CC]/40'}
        mix-blend-difference
      `}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 1
      }}
      className="absolute z-0 h-9 rounded-full bg-[#E1E0CC]"
    />
  );
};

export { InteractiveMenu };

