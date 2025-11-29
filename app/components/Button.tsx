import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  variant?: "primary" | "link";
  size?: "small" | "medium" | "large";
  IconLeft?: any;
  IconRight?: any;
 loadingText? : boolean
}

const baseClasses =
  "relative inline-flex justify-center w-full text-center funnel-sans-text rounded-xl  transition-all duration-300 font-medium text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none space-x-2";

const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 w-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl",
    link: "text-blue-400 hover:text-blue-300 underline transition-colors",
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className,
  disabled,
  type,
  loading,
  IconLeft,
  variant = "primary",
  IconRight,
  loadingText = true,
}) => {
  return (
    <button className={cn(baseClasses, variantClasses[variant], className )} disabled={loading || disabled}  type={type} onClick={onClick}>
       {loading ? (
        <div className="flex gap-4"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin "> 
        
        
        </div>{loadingText? ("Loading...") : null}</div>
      
        ) : (
          <span className="flex items-center justify-center gap-2">{IconLeft && (IconLeft)}{text}{IconRight && (IconRight)}</span>
        )}
     
    </button>
  );
};

export default Button;
