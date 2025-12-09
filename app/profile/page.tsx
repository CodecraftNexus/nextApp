"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Search,
  Loader2,
  ArrowLeft,
  Globe,
  Mail,
  CheckCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Header from "../container/Header";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useFormData from "../hooks/UseFormData";
import { useRouter } from "next/navigation";
import GroupedMultiComboSelect from "../components/profile/ComboSelect";
import Image from "next/image";

// -------------------------------------------------------------------
const LOCATIONIQ_API_KEY = "pk.83ce678095a5989ba69f8649e97e1135";
// -------------------------------------------------------------------

export default function ProfilePage() {
  const { user, updateProfile, getJobsOptions, getEducationOptions } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const UpdateFormData = useFormData({
    gender: "",
    dateOfBirth: "",
    birthTime: "",
    whatsappNumber: "",
    birthLocation: "",
    latitude: "",
    longitude: "",
    jobs: [] as any,
    education: [] as any,
  });

  const [selectedJobs, setSelectedJobs] = useState<
    { option: string; category: string }[]
  >([]);
  const [selectedEducation, setSelectedEducation] = useState<
    { option: string; category: string }[]
  >([]);

  const [jobsOptions, setJobsOptions] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [educationOptions, setEducationOptions] = useState<{
    [key: string]: string[];
  }>({});

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const jobs = await getJobsOptions();

        setJobsOptions(jobs);
        const edu = await getEducationOptions();
        setEducationOptions(edu);
      } catch (err) {
        toast.error("Failed to load options");
        console.error(err);
      }
    };
    fetchOptions();
  }, [getJobsOptions, getEducationOptions]);

  useEffect(() => {
    
    if (user) {
      UpdateFormData.setFormData({
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        birthTime: user.birthTime || "",
        whatsappNumber: user.whatsappNumber || "",
        birthLocation: user.birthLocation || "",
        latitude: user.latitude || "",
        longitude: user.longitude || "",
        jobs: user.jobs || [],
        education: user.education || [],
      });
      setQuery(user.birthLocation || "");
      setPreview(user.profileImage || "");
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(jobsOptions).length > 0 && user?.jobs) {
      setSelectedJobs(
        user.jobs.map((job: string) => ({
          option: job,
          category: findCategory(jobsOptions, job),
        }))
      );
    }
  }, [jobsOptions, user]);

  useEffect(() => {
    if (Object.keys(educationOptions).length > 0 && user?.education) {
      setSelectedEducation(
        user.education.map((edu: string) => ({
          option: edu,
          category: findCategory(educationOptions, edu),
        }))
      );
    }
  }, [educationOptions, user]);

  const findCategory = (
    optionsObj: { [key: string]: string[] },
    option: string
  ): string => {
    for (const [cat, opts] of Object.entries(optionsObj)) {
      if (opts.includes(option)) {
        return cat;
      }
    }
    return "";
  };

  useEffect(() => {
    if (user == null) {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      if (!redirectTimerRef.current) {
        redirectTimerRef.current = setTimeout(() => {
          router.push("/auth");
        }, 3000);
      }
    } else {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [user, router]);

  const searchLocation = async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingLocation(true);
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
          q
        )}&limit=8&countrycodes=lk&accept-language=si,en`
      );
      const data = await res.json();
      if (Array.isArray(data)) setSuggestions(data);
    } catch (err) {
      console.error("Location search error:", err);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const selectLocation = (place: any) => {
    const name = place.display_place || place.display_name.split(",")[0];
    UpdateFormData.setFormData((prev) => ({
      ...prev,
      birthLocation: name,
      latitude: parseFloat(place.lat).toFixed(6),
      longitude: parseFloat(place.lon).toFixed(6),
    }));
    setQuery(name);
    setShowDropdown(false);
    setSuggestions([]);
    toast.success(`Birth location set to ${name}`, {
      icon: "🗺️",
      style: { background: "#10b981", color: "white" },
    });
  };

  const clearLocation = () => {
    UpdateFormData.setFormData((prev) => ({
      ...prev,
      birthLocation: "",
      latitude: "",
      longitude: "",
    }));
    setQuery("");
  };

  const isProfileComplete = user?.isProfileComplete;

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData: any = {
        gender: UpdateFormData.formData.gender,
        dateOfBirth: UpdateFormData.formData.dateOfBirth,
        birthTime: UpdateFormData.formData.birthTime,
        whatsappNumber: UpdateFormData.formData.whatsappNumber,
        birthLocation: UpdateFormData.formData.birthLocation,
        latitude: UpdateFormData.formData.latitude,
        longitude: UpdateFormData.formData.longitude,
        jobs: selectedJobs.map((s) => s.option),
        education: selectedEducation.map((s) => s.option),
      };
      if (imageFile) {
        profileData.profileImage = await toBase64(imageFile);
      }
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      
      // Redirect to home page after successful update
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      UpdateFormData.setFormData({
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        birthTime: user.birthTime || "",
        whatsappNumber: user.whatsappNumber || "",
        birthLocation: user.birthLocation || "",
        latitude: user.latitude || "",
        longitude: user.longitude || "",
        jobs: user.jobs || [],
        education: user.education || [],
      });
      setSelectedJobs(
        user.jobs.map((job: string) => ({
          option: job,
          category: findCategory(jobsOptions, job),
        }))
      );
      setSelectedEducation(
        user.education.map((edu: string) => ({
          option: edu,
          category: findCategory(educationOptions, edu),
        }))
      );
      setQuery(user.birthLocation || "");
      setPreview(user.profileImage || "");
      setImageFile(null);
    }
    setIsEditing(false);
  };

  if (user == null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleJobsChange = (
    selected: { option: string; category: string }[]
  ) => {
    setSelectedJobs(selected);
  };

  const handleEducationChange = (
    selected: { option: string; category: string }[]
  ) => {
    setSelectedEducation(selected);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="bg-white border-b border-gray-200 px-4 py-3 md:hidden flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg">My Profile</span>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-8 pb-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 h-32 md:h-48"></div>
            <div className="relative px-8 pb-10">
              <div className="absolute -top-16 left-8 w-32 h-32 md:w-32 md:h-32">
                <div className="relative w-full h-full">
                  <div className="bg-white rounded-full p-2 shadow-2xl w-full h-full">
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center ${
                        preview ? "overflow-hidden" : "bg-blue-600"
                      }`}
                    >
                      {preview ? (
                        <Image
                          height={400}
                          width={400}
                          src={preview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-gray-200"
                    >
                      <Edit3 className="w-5 h-5 text-blue-600" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-20 md:pt-16 text-center md:text-left md:flex md:justify-between md:items-end">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-black mt-4 md:mt-0">
                    {user.name || user.email?.split("@")[0]}
                  </h1>
                  {user.email ?( <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start mt-2">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>) : "" }
                 
                </div>

                {!isEditing && (
                  <div className="mt-6 md:mt-0 flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg"
                    >
                      <Edit3 className="w-5 h-5" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <User className="w-7 h-7 text-blue-600" /> Personal Information
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Gender</span>
                  {isEditing ? (
                    <select
                      value={UpdateFormData.formData.gender}
                      onChange={(e) =>
                        UpdateFormData.updateField("gender", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <span className="font-medium capitalize">
                      {UpdateFormData.formData.gender || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date of Birth
                  </span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={UpdateFormData.formData.dateOfBirth}
                      onChange={(e) =>
                        UpdateFormData.updateField(
                          "dateOfBirth",
                          e.target.value
                        )
                      }
                      className="px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <span className="font-medium">
                      {UpdateFormData.formData.dateOfBirth
                        ? new Date(
                            UpdateFormData.formData.dateOfBirth
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Birth Time
                  </span>
                  {isEditing ? (
                    <input
                      type="time"
                      value={UpdateFormData.formData.birthTime}
                      onChange={(e) =>
                        UpdateFormData.updateField("birthTime", e.target.value)
                      }
                      className="px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <span className="font-medium">
                      {UpdateFormData.formData.birthTime || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> WhatsApp
                  </span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={UpdateFormData.formData.whatsappNumber}
                      onChange={(e) =>
                        UpdateFormData.updateField(
                          "whatsappNumber",
                          e.target.value
                        )
                      }
                      placeholder="+94..."
                      className="px-4 py-2 border rounded-lg"
                    />
                  ) : (
                    <span className="font-medium">
                      {UpdateFormData.formData.whatsappNumber ||
                        "Not specified"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-blue-600" /> Birth Place
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  {UpdateFormData.formData.birthLocation && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-green-900">
                            {UpdateFormData.formData.birthLocation}
                          </p>
                          <p className="text-sm text-green-700">
                            Lat: {UpdateFormData.formData.latitude} | Lon:{" "}
                            {UpdateFormData.formData.longitude}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearLocation}
                        className="text-green-700 hover:text-green-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      placeholder={
                        UpdateFormData.formData.birthLocation
                          ? "Change birth location..."
                          : "Search city in Sri Lanka..."
                      }
                      className={`w-full pl-11 pr-10 py-3 border-2 rounded-lg focus:border-blue-600 outline-none transition-all ${
                        UpdateFormData.formData.birthLocation
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300"
                      }`}
                    />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    {query && (
                      <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-3.5"
                      >
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}

                    {showDropdown && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                        {loadingLocation ? (
                          <div className="p-4 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />{" "}
                            Searching...
                          </div>
                        ) : suggestions.length > 0 ? (
                          suggestions.map((place, i) => (
                            <button
                              key={i}
                              onClick={() => selectLocation(place)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 flex gap-3"
                            >
                              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <div className="font-medium">
                                  {place.display_place ||
                                    place.display_name.split(",")[0]}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Sri Lanka
                                </div>
                              </div>
                            </button>
                          ))
                        ) : query.length >= 2 ? (
                          <div className="p-4 text-gray-500">
                            No results found
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ) : UpdateFormData.formData.birthLocation ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <p className="text-lg font-bold text-black mb-3">
                      {UpdateFormData.formData.birthLocation}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg">
                        <span className="text-gray-600 block">Lat</span>
                        <code className="font-mono text-blue-700 font-bold">
                          {UpdateFormData.formData.latitude}
                        </code>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <span className="text-gray-600 block">Lon</span>
                        <code className="font-mono text-blue-700 font-bold">
                          {UpdateFormData.formData.longitude}
                        </code>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${UpdateFormData.formData.latitude},${UpdateFormData.formData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Globe className="w-5 h-5" /> View on Google Maps
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 italic">Birth location not set</p>
              )}
            </div>

            {/* New Education Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <GraduationCap className="w-7 h-7 text-blue-600" /> Education
                Qualifications
              </h2>

              {isEditing ? (
                <GroupedMultiComboSelect
                  options={educationOptions}
                  placeholder="Search and select education qualifications..."
                  onChange={handleEducationChange}
                  value={selectedEducation}
                />
              ) : selectedEducation.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedEducation.map((edu, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {edu.option}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No education qualifications added
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-blue-600" /> Preferred Jobs
              </h2>

              {isEditing ? (
                <GroupedMultiComboSelect
                  options={jobsOptions}
                  placeholder="Search and select preferred jobs..."
                  onChange={handleJobsChange}
                  value={selectedJobs}
                />
              ) : selectedJobs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedJobs.map((job, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {job.option}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No preferred jobs added</p>
              )}
            </div>
          </div>

          {!isProfileComplete && !isEditing && (
            <div className="mt-10 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Complete Your Profile for Accurate Predictions
              </h3>
              <p className="text-amber-800 mb-6">
                ඔබේ ජන්ම පත්‍රය නිවැරදිව ගණනය කිරීමට සියලුම තොරතුරු අවශ්‍යයි
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-amber-700 text-lg shadow-lg"
              >
                Complete Profile Now
              </button>
            </div>
          )}

          {isProfileComplete && !isEditing && (
            <div className="mt-10 bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center flex items-center justify-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-green-900">
                  Profile Complete!
                </h3>
                <p className="text-green-700">
                  You're all set for accurate horoscope predictions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Save/Cancel Buttons */}
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 flex items-center gap-2 shadow-lg"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}