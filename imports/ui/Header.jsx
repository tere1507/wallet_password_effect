import React from "react";

export const Header = ({ user, onLogout }) => {
    return (
    <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-3xl font-extrabold tracking-tight">My Wallet AT</h1>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium">¡Hi, {user?.emails?.[0]?.address || user?.username || 'Usuario'}!</span>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          Close Session
        </button>
      </div>
    </header>
  );
};
