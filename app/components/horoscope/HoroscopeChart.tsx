import React from "react";


interface HoroscopeChartProps {
  lagnaya?: any;
  isHoroscope?: boolean;
  indexses?: { [key: number]: { [key: string]: string } };
}

const HoroscopeChart:React.FC<HoroscopeChartProps> = ({ isHoroscope ,lagnaya, indexses }) => {
  return (
    <div className="w-full items-center flex justify-center">
      <div className="w-full max-w-lg">
        <div className="border-2 border-gray-800 grid grid-cols-3 w-full aspect-square shadow-2xl bg-white">
          {/* Box 11-10 (Top Left) */}
          <div className="border border-gray-700 relative aspect-square">
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 funnel-sans-text text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[2] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold funnel-sans-text grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[3] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="black"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Box 12 (Top Center) */}
          <div className="border border-gray-700 aspect-square flex justify-center items-center funnel-sans-text text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
            <div className="grid grid-cols-2 gap-1 p-1">
              {Object.entries(indexses?.[1] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Box 1-2 (Top Right) */}
          <div className="border border-gray-700 relative aspect-square">
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[12] ?? {})?.map(([key, value]) => (
                <span key={key} className="funnel-sans-text leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg grid grid-cols-2 gap-0.5 font-semibold funnel-sans-text">
              {Object.entries(indexses?.[11] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                x1="100%"
                y1="0"
                x2="0"
                y2="100%"
                stroke="black"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Box 9 (Middle Left) */}
          <div className="border border-gray-700 aspect-square flex justify-center funnel-sans-text text-xs sm:text-sm md:text-base lg:text-lg items-center font-semibold">
            <div className="grid grid-cols-2 gap-1 p-1">
              {Object.entries(indexses?.[4] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Center (Lagnaya) */}
          <div className="border-2 border-gray-900 aspect-square flex flex-col justify-center items-center funnel-sans-text text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-linear-to-br from-purple-50 to-indigo-50">
            <span className="text-center leading-tight">
              {lagnaya}
            </span>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg mt-1">
              {isHoroscope ? "ලග්නය" : "නවාංශකය"}
            </span>
          </div>

          {/* Box 3 (Middle Right) */}
          <div className="border border-gray-700 aspect-square flex justify-center funnel-sans-text items-center text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
            <div className="grid grid-cols-2 gap-1 p-1">
              {Object.entries(indexses?.[10] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Box 8-7 (Bottom Left) */}
          <div className="border border-gray-700 relative aspect-square">
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[5] ?? {})?.map(([key, value]) => (
                <span key={key} className="funnel-sans-text leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg funnel-sans-text font-semibold grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[6] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="100%"
                x2="100%"
                y2="0"
                stroke="black"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Box 6 (Bottom Center) */}
          <div className="border border-gray-700 aspect-square flex justify-center items-center text-xs sm:text-sm md:text-base lg:text-lg font-semibold funnel-sans-text">
            <div className="grid grid-cols-2 gap-1 p-1">
              {Object.entries(indexses?.[7] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* Box 5-4 (Bottom Right) */}
          <div className="border border-gray-700 relative aspect-square">
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
              {Object.entries(indexses?.[8] ?? {})?.map(([key, value]) => (
                <span key={key} className="funnel-sans-text leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg grid grid-cols-2 gap-0.5 font-semibold">
              {Object.entries(indexses?.[9] ?? {})?.map(([key, value]) => (
                <span key={key} className="leading-tight">
                  {value}
                </span>
              ))}
            </div>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="black"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeChart;
