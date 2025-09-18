"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

// Animated button with feedback
type AnimatedButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "success" | "error" | "warning";
  className?: string;
  disabled?: boolean;
};

export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = "default", 
  className,
  disabled 
}: AnimatedButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    success: "bg-green-600 text-white hover:bg-green-700",
    error: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
  };

  return (
    <motion.button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      disabled={disabled}
      animate={{
        boxShadow: isPressed 
          ? "0 2px 4px rgba(0,0,0,0.1)" 
          : "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </motion.button>
  );
};

// Toast notification with animations
type ToastNotificationProps = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
};

export const ToastNotification = ({
  type,
  title,
  description,
  isVisible,
  onClose,
  duration = 5000,
}: ToastNotificationProps) => {
  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const Icon = icons[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg",
            colors[type]
          )}
        >
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold">{title}</h4>
              {description && (
                <p className="text-sm mt-1 opacity-90">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-current opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Floating action button with ripple effect
type FloatingActionButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position?: "bottom-right" | "bottom-left";
  className?: string;
};

export const FloatingActionButton = ({
  onClick,
  icon,
  label,
  position = "bottom-right",
  className,
}: FloatingActionButtonProps) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick();
  };

  return (
    <motion.button
      className={cn(
        "fixed z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring",
        "flex items-center justify-center overflow-hidden relative",
        positionClasses[position],
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      aria-label={label}
    >
      {icon}
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
            }}
            initial={{ width: 20, height: 20, opacity: 1 }}
            animate={{ width: 100, height: 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

// Progress indicator with smooth animations
type ProgressIndicatorProps = {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
};

export const ProgressIndicator = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
}: ProgressIndicatorProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};