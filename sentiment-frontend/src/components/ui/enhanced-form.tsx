"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

// Enhanced input with validation feedback
type EnhancedInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "search";
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  label?: string;
  className?: string;
  disabled?: boolean;
};

export const EnhancedInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  validation,
  label,
  className,
  disabled,
}: EnhancedInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const validateInput = (inputValue: string) => {
    if (!validation) return null;

    if (validation.required && !inputValue.trim()) {
      return "This field is required";
    }

    if (validation.minLength && inputValue.length < validation.minLength) {
      return `Minimum ${validation.minLength} characters required`;
    }

    if (validation.maxLength && inputValue.length > validation.maxLength) {
      return `Maximum ${validation.maxLength} characters allowed`;
    }

    if (validation.pattern && !validation.pattern.test(inputValue)) {
      return "Invalid format";
    }

    if (validation.custom) {
      return validation.custom(inputValue);
    }

    return null;
  };

  useEffect(() => {
    if (value) {
      const validationError = validateInput(value);
      setError(validationError);
      setIsValid(validationError === null);
    } else {
      setError(null);
      setIsValid(null);
    }
  }, [value, validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 border rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            {
              "border-red-500 focus:border-red-500": error,
              "border-green-500 focus:border-green-500": isValid && !error,
              "border-input": !error && !isValid,
            }
          )}
          animate={{
            borderColor: error 
              ? "#ef4444" 
              : isValid 
                ? "#10b981" 
                : isFocused 
                  ? "#3b82f6" 
                  : "#e5e7eb",
          }}
        />
        
        {/* Validation icon */}
        <AnimatePresence>
          {(error || isValid) && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {error ? (
                <X className="h-4 w-4 text-red-500" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated card with hover effects
type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
};

export const AnimatedCard = ({ 
  children, 
  className, 
  onClick, 
  hoverable = true 
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hoverable ? {
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for real-time indicators
export const PulseIndicator = ({ 
  isActive, 
  className 
}: { 
  isActive: boolean; 
  className?: string; 
}) => (
  <motion.div
    className={cn("h-2 w-2 rounded-full bg-green-500", className)}
    animate={isActive ? {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
    } : {}}
    transition={{
      duration: 1.5,
      repeat: isActive ? Infinity : 0,
    }}
  />
);

// Stagger animation container
type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
};

export const StaggerContainer = ({ 
  children, 
  className, 
  staggerDelay = 0.1 
}: StaggerContainerProps) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    {children}
  </motion.div>
);