import { BadgeAlert, CircleCheckBig } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { shake } from "@/app/utils/animations";

interface AlertProps {
  Error?: string;
  Success?: string;
}

const Alert: React.FC<AlertProps> = ({ Error, Success }) => {
  const AlertRef = useRef<HTMLDivElement>(null);
 

  useEffect(() => {
   shake(AlertRef.current, {
      intensity: 20,
      repeat: 4
    });
  }, [Error, Success]);

  return (
    <div ref={AlertRef} 
      className={`${
        Error
          ? "border-red-500/50 text-red-700"
          : "border-green-500/50 text-green-700 "
      } h-auto w-full py-2 flex justify-center gap-2  items-center border funnel-sans-text rounded-lg mb-2 px-2`}
    >
      {Error ? <BadgeAlert size={18} /> : <CircleCheckBig size={18} />}
      {Error ? Error : Success}
    </div>
  );
};

export default Alert;
