import { motion } from 'framer-motion';
import React from 'react';

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, color = 'currentColor', className }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360
      },
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 1,
    },
  };

  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      className={className}
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  );
};