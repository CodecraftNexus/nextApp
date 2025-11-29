import { LogOut, UserCircle } from 'lucide-react';
import {useRouter} from 'next/navigation';
import React from 'react'

interface profiledropdownprops { 
full_name?: string;
email? : string; 
isProfileOpen : boolean;
setIsNotificationOpen? : () => void
onclick: () => void
logout : () =>void
}

const profiledropdown:React.FC<profiledropdownprops> = ({onclick , full_name,email , isProfileOpen , logout}) => {
  const router = useRouter();
  return (
     <div className="relative">
            <button
              onClick={onclick}
              className="px-2 md:px-4 py-2 flex items-center rounded-lg text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 flex justify-center items-center md:mr-3 rounded-full bg-black text-white">{full_name?.charAt(0)}</div>
              <span className="hidden md:inline">{full_name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3 fill-gray-600 ml-2 md:ml-3 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{full_name}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{email}</p>
                </div>
                <div className="py-2">
                  <button onClick={() => {
                    router.push("/profile")
                  }}  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

  )
}

export default profiledropdown