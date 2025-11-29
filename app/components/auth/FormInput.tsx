import { BadgeAlert, Check, Eraser, Eye, EyeClosed } from "lucide-react";
import React from "react";
import { shake } from "@/app/utils/animations";

interface FormInputProps {
  type: string;
  label?: string | any;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  ispassword?: boolean;
  setshowpassword?: React.Dispatch<React.SetStateAction<boolean>>;
  showpassword?: boolean;
  Icon?: any;
  isStrong?: boolean;
  isCheckbox?: boolean;
  checkboxValue? : boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
  ispassword,
  setshowpassword,
  showpassword,
  isStrong,
  Icon,
  isCheckbox,
  checkboxValue,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [hasShownInitially, setHasShownInitially] = React.useState(false);
  const InputRef = React.useRef(null); 


  React.useEffect(() => {
    if (error) {
      setShowTooltip(true);
      setHasShownInitially(true);

      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    

       
    shake(InputRef.current, {
            intensity: 20,
            repeat: 4
          });

      return;
    }

  }, [error, hasShownInitially]);

  return (
    <div ref={InputRef}
      className={
        isCheckbox
          ? "flex gap-2 flex-row-reverse items-center justify-center"
          : ""
      }
    >
      {label && (
        <label
          className={`block ${
            isCheckbox ? "" : "mb-2"
          } text-sm font-medium funnel-sans-text text-gray-900 capitalize`}
          htmlFor={label}
        >
          {label}
        </label>
      )}
      <div className={isCheckbox ? "hidden" : "relative"}>
        <input
          id={label}
          type={ispassword ? (showpassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} py-2.5 bg-white text-gray-900 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 ${className} ${
            ispassword && error ? "pr-16" : ispassword ? "pr-10" : "pr-4"
          }`}
        />
        {ispassword && setshowpassword && (
          <button
            type="button"
            onClick={() => setshowpassword(!showpassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showpassword ? (
              <EyeClosed className={error ? "text-red-500" : ""} size={18} />
            ) : (
              <Eye size={18} className={error ? "text-red-500" : ""} />
            )}
          </button>
        )}
        {Icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
              error ? "text-red-600" : ""
            }`}
          >
            <Icon size={18} />
          </div>
        )}

        {error && (
          <div
            className={`absolute inset-y-0 ${
              ispassword ? "mr-10" : "mr-4"
            } right-0 flex items-center cursor-pointer text-red-600 group  h-full`}
          >
            <BadgeAlert
              size={18}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />

            <div
              className={`${
                showTooltip ? "opacity-100 visible" : "opacity-0 invisible"
              } transition-all duration-1000 ease-in-out absolute right-0 top-full mt-1 z-10`}
            >
              <div className="bg-red-500 text-white text-xs rounded-md px-3 py-1.5 shadow-lg whitespace-nowrap">
                <p className="font-medium">{error}</p>
                {/* Arrow pointing up */}
                <div className="absolute bottom-full right-2 border-4 border-transparent border-b-red-500"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isCheckbox ? (
        <div className="inline-flex items-center">
          <label className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
             className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-500"
              id="check"
              checked={checkboxValue}
              onChange={onChange}
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Check size={12} strokeWidth={5} />
            </span>
          </label>
        </div>
      ) : (
        ""
      )}

      
    </div>
  );
};

export default FormInput;
