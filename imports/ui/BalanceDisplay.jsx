import React from "react";

export const BalanceDisplay = ({ balance }) => {
    return (
    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900 rounded-md shadow-inner">
      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-200">Current Balance</p>
      <p className="text-5xl font-extrabold text-emerald-800 dark:text-emerald-50 text-shadow-lg">{balance.toFixed(2)}€</p>
    </div>
  );
}