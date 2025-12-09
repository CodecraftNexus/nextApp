import { LogOut, UserCircle, Plus, Check, Crown, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Account {
  id: string;
  name: string;
  nickname: string;
  isMain?: boolean;
  profileImage?: string;
}

interface ProfileDropdownProps {
  currentAccount?: Account;
  accounts?: Account[];
  isProfileOpen?: boolean;
  onclick: () => void;
  onSwitchAccount?: (account: Account) => void;
  onAddAccount?: (name: string, nickname: string) => void;
  logout?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onclick,
  currentAccount,
  accounts,
  isProfileOpen,
  onSwitchAccount,
  onAddAccount,
  logout,
}) => {
  const router = useRouter();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchAccount = async (account: Account) => {
    if (isSwitching) return; // Prevent double-clicks

    setIsSwitching(true);
    try {
      await onSwitchAccount?.(account);
      setShowSwitchMenu(false);
      onclick();
    } catch (error) {
      console.error("Switch account error:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAddAccount = () => {
    if (accounts && accounts.length >= 10) {
      alert("Maximum 10 profiles allowed!");
      return;
    }

    if (newName.trim() && newNickname.trim()) {
      onAddAccount?.(newName.trim(), newNickname.trim());
      setNewName("");
      setNewNickname("");
      setShowAddModal(false);
      setShowSwitchMenu(false);
      onclick();
    }
  };

  // Separate main and sub accounts
  const mainAccount = accounts?.find((acc) => acc.isMain);
  const subAccounts = accounts?.filter((acc) => !acc.isMain) || [];

  return (
    <>
      <div className="relative">
        <button
          onClick={onclick}
          className="px-2 md:px-4 py-2 flex items-center rounded-lg text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <div className="w-7 h-7 flex justify-center items-center md:mr-3 rounded-full bg-black text-white text-sm overflow-hidden">
            {currentAccount?.profileImage ? (
              <Image
                src={currentAccount.profileImage}
                alt={currentAccount?.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              currentAccount?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <span className="hidden md:inline capitalize">
            {currentAccount?.name}
          </span>
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
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 flex justify-center items-center rounded-full bg-black text-white text-lg font-semibold overflow-hidden">
                    {currentAccount?.profileImage ? (
                      <Image
                        src={currentAccount.profileImage}
                        alt={currentAccount?.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentAccount?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  {currentAccount?.isMain && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                      <Crown className="w-3 h-3 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate capitalize">
                      {currentAccount?.nickname}
                    </p>
                    {currentAccount?.isMain && (
                      <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {currentAccount?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={() => {
                  router.push("/profile");
                  onclick();
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </button>
            </div>

            <div className="border-t border-gray-100">
              <button
                onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <span>Switch Account ({accounts?.length || 0}/10)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 fill-gray-600 transition-transform ${
                    showSwitchMenu ? "rotate-180" : ""
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

              {showSwitchMenu && (
                <div className="bg-gray-50 py-2 max-h-64 overflow-y-auto">
                  {/* Main Account */}
                  {mainAccount && (
                    <button
                      key={mainAccount.id}
                      onClick={() => handleSwitchAccount(mainAccount)}
                      disabled={
                        isSwitching || mainAccount.id === currentAccount?.id
                      }
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-700 text-white text-sm font-semibold overflow-hidden">
                          {mainAccount.profileImage ? (
                            <Image
                              src={mainAccount.profileImage}
                              alt={mainAccount.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            mainAccount.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 text-yellow-900" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate capitalize">
                            {mainAccount.nickname}
                          </p>
                          <span className="text-xs font-medium text-yellow-700">
                            Main
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {mainAccount.name}
                        </p>
                      </div>
                      {mainAccount.id === currentAccount?.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  )}

                  {/* Sub Accounts */}
                  {subAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleSwitchAccount(account)}
                      disabled={
                        isSwitching || account.id === currentAccount?.id
                      }
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-700 text-white text-sm font-semibold overflow-hidden">
                        {account.profileImage ? (
                          <Image
                            src={account.profileImage}
                            alt={account.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          account.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate capitalize">
                          {account.nickname}
                        </p>
                        <p className="text-xs text-gray-500 truncate capitalize">
                          {account.name}
                        </p>
                      </div>
                      {account.id === currentAccount?.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}

                  {currentAccount?.isMain ? (
                    <button
                      onClick={() => setShowAddModal(true)}
                      disabled={accounts && accounts.length >= 10}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-100 text-blue-600">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-sm">
                        {accounts && accounts.length >= 10
                          ? "Max profiles reached"
                          : "Add Profile"}
                      </span>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 py-2">
              <button
                onClick={() => {
                  logout?.();
                  onclick();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Profile
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewName("");
                  setNewNickname("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nickname
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="Enter nickname"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewName("");
                  setNewNickname("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={!newName.trim() || !newNickname.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
