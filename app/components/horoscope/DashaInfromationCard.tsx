import React from "react";

interface DashaInfromationCardProps {
  ismahaDaha?: boolean;
  items?: any;
}


const DashaInfromationCard: React.FC<DashaInfromationCardProps> = ({
  ismahaDaha,
  items,
}) => {
  return (
    <div className="group">
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100">
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            {ismahaDaha ? "මහදශාව" : "අන්තර්දශාව"}
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-white/30 rounded-full mt-2"></div>
        </div>
        <div className="p-4 sm:p-6">
          {items ? (
            <div className="space-y-3">
              {items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600"></div>
                    <span className="text-gray-700 text-base sm:text-lg font-medium">
                      {ismahaDaha ? item.dasha : item.anthardhashawa}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600 ml-5 sm:ml-0">
                    {item.from} - {item.to}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashaInfromationCard;
