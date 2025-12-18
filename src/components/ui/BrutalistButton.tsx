/**
 * BrutalistButton - Neo-Brutalist Button Component
 * Hard edges, thick borders, mechanical shadow interaction
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BrutalistButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  as?: 'button' | 'a';
  href?: string;
}

export default function BrutalistButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  as: Component = 'button',
  href,
}: BrutalistButtonProps) {
  const baseClasses = 'rounded-none border-2 font-semibold transition-all duration-100 relative';

  const variantClasses = {
    primary: 'bg-piko-teal border-zinc-100 text-zinc-950 shadow-[4px_4px_0px_#00f5d4] hover:shadow-[2px_2px_0px_#00f5d4]',
    secondary: 'bg-zinc-900 border-zinc-100 text-zinc-100 shadow-[4px_4px_0px_#00f5d4] hover:shadow-[2px_2px_0px_#00f5d4]',
    outline: 'bg-transparent border-zinc-100 text-zinc-100 shadow-[4px_4px_0px_#00f5d4] hover:shadow-[2px_2px_0px_#00f5d4]',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer active:translate-y-[4px] active:translate-x-[4px] active:shadow-none';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const buttonProps = {
    className: combinedClasses,
    disabled,
    onClick: disabled ? undefined : onClick,
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98, translateY: 4, translateX: 4 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  };

  if (Component === 'a' && href) {
    return (
      <motion.a
        href={href}
        {...buttonProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}

