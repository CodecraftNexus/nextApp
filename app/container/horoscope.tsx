"use client";

import { User, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useEffect } from "react";

const Horoscope = () => {
  const {
    user,
    isAuthenticated,
    GetPlanet,
    Getmahadasha,
    planet,
    mahadasha,
    anthardahsa,
    getAntharDasha,
    loading: planetLoading,
  } = useAuth();

  const isProfileComplete = user?.isProfileComplete;

  useEffect(() => {
    if (isAuthenticated && isProfileComplete) {
      GetPlanet();
      Getmahadasha();
      getAntharDasha();
    }
  }, [isAuthenticated, isProfileComplete]);

  if (!isAuthenticated || user === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your horoscope...</p>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="flex justify-center mb-8">
            <div className="bg-white/90 rounded-full p-6 shadow-2xl">
              <User className="w-20 h-20 text-indigo-700" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-white text-4xl font-bold text-center mb-4">
            පළමුව ඔබේ තොරතුරු පුරවන්න
          </h1>
          <p className="text-blue-100 text-center text-lg mb-10">
            නිවැරදි ජන්ම පත්‍රයක් ලබාගැනීමට ඔබේ උපන් දිනය, වේලාව සහ ස්ථානය
            අවශ්‍යයි
          </p>
          <Link href="/profile">
            <button className="w-full bg-white text-indigo-700 font-bold text-xl py-5 px-8 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105">
              ප්‍රොෆයිල් පිරවීමට යන්න
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (planetLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700 font-medium">
            ඔබේ ජන්ම පත්‍රය ගණනය කරමින්...
          </p>
          <p className="text-gray-500 mt-2">මද වේලාවක් රැඳී සිටින්න</p>
        </div>
      </div>
    );
  }

  if (
    !planet?.result?.data ||
    !mahadasha?.result?.data ||
    !anthardahsa?.result?.data
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-700 text-xl font-semibold mb-2">
            ජන්ම පත්‍රය ලැබී නැහැ :(
          </p>
          <p className="text-red-600">නැවත උත්සාහ කරන්න හෝ පසුව එන්න</p>
        </div>
      </div>
    );
  }

  const data = planet.result.data;
  const mahadashaData = mahadasha.result.data;
  const AnthardashaData = anthardahsa.result.data;

  const boxes: Record<number, string[]> = {
    1: data.box1 || [],
    2: data.box2 || [],
    3: data.box3 || [],
    4: data.box4 || [],
    5: data.box5 || [],
    6: data.box6 || [],
    7: data.box7 || [],
    8: data.box8 || [],
    9: data.box9 || [],
    10: data.box10 || [],
    11: data.box11 || [],
    12: data.box12 || [],
  };

  const indexses: Record<number, Record<number, string>> = {};
  Object.entries(boxes).forEach(([boxNum, planets]) => {
    const num = parseInt(boxNum);
    indexses[num] = {};
    planets.forEach((p, i) => {
      indexses[num][i + 1] = p;
    });
  });

  // const indexses = {
  //   1: { 1: "1" },
  //   2: { 1: "2" },
  //   3: { 1: "3" },
  //   4: { 1: "4" },
  //   5: { 1: "5" },
  //   6: { 1: "6" },
  //   7: { 1: "7" },
  //   8: { 1: "8" },
  //   9: { 1: "9" },
  //   10: { 1: "10" },
  //   11: { 1: "11" },
  //   12: { 1: "12" },
  // };

  const { dasha, from, to } = mahadashaData.current_dasha;

  const antardashaItems = AnthardashaData.current_antardasha_set;

  return (
    <div className="w-full min-h-screen px-4 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          {/* Horoscope Chart */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-lg">
              <div className="border-2 border-gray-800 grid grid-cols-3 w-full aspect-square shadow-2xl bg-white">
                {/* Box 11-10 (Top Left) */}
                <div className="border border-gray-700 relative aspect-square">
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 funnel-sans-text text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[2])?.map(([key, value]) => (
                      <span key={key} className="leading-tight">
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold funnel-sans-text grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[3]).map(([key, value]) => (
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
                    {Object.entries(indexses[1]).map(([key, value]) => (
                      <span key={key} className="leading-tight">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Box 1-2 (Top Right) */}
                <div className="border border-gray-700 relative aspect-square">
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[12]).map(([key, value]) => (
                      <span
                        key={key}
                        className="funnel-sans-text leading-tight"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg grid grid-cols-2 gap-0.5 font-semibold funnel-sans-text">
                    {Object.entries(indexses[11]).map(([key, value]) => (
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
                    {Object.entries(indexses[4]).map(([key, value]) => (
                      <span key={key} className="leading-tight">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center (Lagnaya) */}
                <div className="border-2 border-gray-900 aspect-square flex flex-col justify-center items-center funnel-sans-text text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-br from-purple-50 to-indigo-50">
                  <span className="text-center leading-tight">
                    {planet?.result?.data?.lagnaya}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg mt-1">
                    ලග්නය
                  </span>
                </div>

                {/* Box 3 (Middle Right) */}
                <div className="border border-gray-700 aspect-square flex justify-center funnel-sans-text items-center text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {Object.entries(indexses[10]).map(([key, value]) => (
                      <span key={key} className="leading-tight">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Box 8-7 (Bottom Left) */}
                <div className="border border-gray-700 relative aspect-square">
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[5]).map(([key, value]) => (
                      <span
                        key={key}
                        className="funnel-sans-text leading-tight"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg funnel-sans-text font-semibold grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[6]).map(([key, value]) => (
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
                    {Object.entries(indexses[7]).map(([key, value]) => (
                      <span key={key} className="leading-tight">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Box 5-4 (Bottom Right) */}
                <div className="border border-gray-700 relative aspect-square">
                  <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs sm:text-sm md:text-base lg:text-lg font-semibold grid grid-cols-2 gap-0.5">
                    {Object.entries(indexses[8]).map(([key, value]) => (
                      <span
                        key={key}
                        className="funnel-sans-text leading-tight"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xs sm:text-sm md:text-base lg:text-lg grid grid-cols-2 gap-0.5 font-semibold">
                    {Object.entries(indexses[9]).map(([key, value]) => (
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

          {/* Dasha Information */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="flex flex-col gap-6 w-full max-w-lg">
              {/* Mahadasha Card */}
              <div className="group">
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      මහදශාව
                    </h2>
                    <div className="h-1 w-16 sm:w-20 bg-white/30 rounded-full mt-2"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          {dasha}
                        </span>
                      </div>
                      <span className="text-sm sm:text-base text-gray-600 ml-5 sm:ml-0">
                        {from} - {to}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Antardasha Card */}
              <div className="group">
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-indigo-100">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      අන්තර්දශාව
                    </h2>
                    <div className="h-1 w-16 sm:w-20 bg-white/30 rounded-full mt-2"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {antardashaItems.map((item : any, index : any) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 group/item"
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 group-hover/item:scale-150 transition-transform duration-200 flex-shrink-0"></div>
                          <div className="flex-1">
                            <span className="text-gray-700 group-hover/item:text-indigo-700 transition-colors duration-200 text-base sm:text-lg font-medium">
                              {item?.anthardhashawa}
                            </span>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              {item?.from} - {item?.to}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horoscope;
