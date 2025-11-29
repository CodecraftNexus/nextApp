"use client";

import { Bell } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Profiledropdown from "../components/profiledropdown";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { logout, user, isAuthenticated } = useAuth();


  // ███████████████████████████████████████████████████████████
  useEffect(() => {
    if (!isAuthenticated) {
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


    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [isAuthenticated, router]);
  // ███████████████████████████████████████████████████████████

  const notifications = [
    { id: 1, title: "New message received", time: "5 min ago", unread: true },
    { id: 2, title: "Project update available", time: "1 hour ago", unread: true },
    { id: 3, title: "Meeting reminder", time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  return (
    <div className="flex px-5 py-4 justify-center shadow-sm border-b border-gray-200 items-center bg-white">
      <div className="flex w-full max-w-7xl justify-between items-center">
        <Link
          href={"/"}
          className="logo text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Logo
        </Link>

        <div className="profile flex flex-row-reverse gap-2 md:gap-4 items-center">
          {isAuthenticated && (
            <>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 max-w-[calc(100vw-2rem)]">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-sm text-gray-900">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors last:border-b-0 ${
                              notif.unread ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {notif.unread && (
                                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-3 py-2 bg-gray-50 text-center">
                      <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>


              <Profiledropdown
                logout={logout}
                onclick={handleProfileToggle}
                isProfileOpen={isProfileOpen}
                full_name={user?.name}
                email={user?.email}
              />
            </>
          )}
        </div>
      </div>

      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/0"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Header;