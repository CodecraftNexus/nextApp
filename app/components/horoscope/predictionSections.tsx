import { pre } from "framer-motion/client";
import { Check, RefreshCcw, X } from "lucide-react";
import React from "react";

interface PredictionSectionsProps {
  predictionTitle?: string;
  handleCorrect?: () => void;
  handleInCorrect?: () => void;
  predictionContent?: any;
}

const predictionSections: React.FC<PredictionSectionsProps> = ({
  predictionTitle,
  handleCorrect,
  handleInCorrect,
  predictionContent,
}) => {
  return (
    <div className="w-full flex flex-col mt-12 gap-6  mx-auto bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 p-6">
      <h1 className="text-2xl font-bold funnel-sans-text">
        {predictionTitle}{" "}
      </h1>
      <div className="h-1 w-16 sm:w-20 bg-black/30 rounded-full mt-2"></div>
      {predictionContent?.map((content: any, index: number) => (
        <div className="flex flex-col gap-4  mt-4" key={index}>
          <h4 className="capitalize text-xl font-bold funnel-sans-text">
            {content.title}
          </h4>
          {content?.predictionText?.map((text: string, idx: number) => (
            
          <div className="flex items-center gap-3" key={idx}>
            <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600"></div>
            <span className="text-gray-700 text-md funnel-sans-text capitalize">
              {text}
            </span>
            <div className="ml-auto flex items-center gap-2 lg:flex-row flex-col">
              <button
                onClick={handleCorrect}
                className="bg-green-600 p-1 rounded text-white"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleInCorrect}
                className="bg-red-600 p-1 rounded text-white"
              >
                <X size={14} />
              </button>
                 <button
                onClick={handleInCorrect}
                className="bg-blue-600 p-1 rounded text-white"
              >
                <RefreshCcw size={14} />
              </button>
            </div>
          </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default predictionSections;
