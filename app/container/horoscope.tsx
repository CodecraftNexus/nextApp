"use client";

import { User, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import HoroscopeChart from "../components/horoscope/HoroscopeChart";
import DashaInfromationCard from "../components/horoscope/DashaInfromationCard";
import PredictionSections from "../components/horoscope/predictionSections";

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
    predictions,
    preditions,
    loading: planetLoading,
  } = useAuth();

  const [allPredictionsLoaded, setAllPredictionsLoaded] = useState(false);
  const isProfileComplete = user?.isProfileComplete;
  
  // Prevent multiple loads
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple simultaneous loads
    if (hasLoadedRef.current) return;
    
    if (!isAuthenticated) return;
    
    if (user === null) {
      window.location.href = "/Auth";
      return;
    }
    
    if (!isProfileComplete) {
      window.location.href = "/profile";
      return;
    }

    // Mark as loading started
    hasLoadedRef.current = true;

    // Load all data once
    const loadAllData = async () => {
      const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Saturn", "Jupiter", "Rahu", "Ketu"];
      
      try {
        // Run in parallel for better performance
        await Promise.all([
          GetPlanet(),
          Getmahadasha(),
          getAntharDasha(),
          ...planets.map(planet => preditions(planet))
        ]);
        
        setAllPredictionsLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        hasLoadedRef.current = false; // Allow retry on error
      }
    };
    
    loadAllData();
  }, [isAuthenticated, isProfileComplete]); // Only depend on these critical values

  // Monitor prediction loading separately (no side effects)
  useEffect(() => {
    const requiredPlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Saturn", "Jupiter", "Rahu", "Ketu"];
    const allLoaded = requiredPlanets.every(planet => 
      predictions[planet]?.result?.data?.predictions
    );
    
    if (allLoaded && !allPredictionsLoaded) {
      setAllPredictionsLoaded(true);
    }
  }, [predictions]);

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
      <div className="min-h-screen bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
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

  if (planetLoading || !allPredictionsLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
          <p className="text-xl text-gray-700 font-medium">
            {!allPredictionsLoaded 
              ? "අනාවැකි ලබාගනිමින්..." 
              : "ඔබේ ජන්ම පත්‍රය ගණනය කරමින්..."}
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

  const handleCorrect = () => {
    console.log("User marked as correct");
  };

  const handleInCorrect = () => {
    console.log("User marked as incorrect");
  };

  const getPredictoncontent = (planet: any | string) => {
    const predicttionData = predictions[planet]?.result?.data?.predictions;
    
    if (!predicttionData || !predicttionData[0]) {
      return [];
    }
    
    const predictionContent = Object.entries(predicttionData[0])
      .filter(([key]) => key !== "Predictionsname")
      .map(([key, value]: [string, any]) => ({
        title: key,
        predictionText: value.split('.').filter((sentence: any) => sentence.trim() !== '').map((sentence: any) => sentence.trim() + '.')
      }));

    return predictionContent;
  }

  const mahadashaItems = mahadashaData.current_mahadasha_set;
  const antardashaItems = AnthardashaData.current_antardasha_set;

  return (
    <div className="w-full min-h-screen px-4 py-6 md:py-8">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-start justify-center">
          <div className="wrapper flex-col gap-14 w-full lg:w-1/2 flex justify-center items-center">
            <HoroscopeChart
              indexses={indexses}
              lagnaya={planet?.result?.data?.lagnaya}
              isHoroscope={true}
            />
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="flex flex-col gap-6 w-full">
              <DashaInfromationCard items={mahadashaItems} ismahaDaha={true} />
              <DashaInfromationCard
                items={antardashaItems}
                ismahaDaha={false}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="group w-full mt-5">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100">
          <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Prediction
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-white/30 rounded-full mt-2"></div>
          </div>
          <div className="p-4 sm:p-6">
            <PredictionSections predictionTitle="සූර්‍යයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Sun")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="චන්ද්‍රයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Moon")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="බුධ ග්‍රහයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Mercury")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="ශුක්‍ර ග්‍රහයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Venus")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="අඟහරු ග්‍රහයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Mars")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="සෙනසුරු ග්‍රහයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Saturn")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="බ්‍රහස්පති ග්‍රහයාට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Jupiter")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="රාහුට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Rahu")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
            <PredictionSections predictionTitle="කේතුට අනුව ඔබගේ බලපෑම" predictionContent={getPredictoncontent("Ketu")} handleCorrect={handleCorrect} handleInCorrect={handleInCorrect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horoscope;