import React from "react";

export const Footer = () => {
    return (
    <footer className="bg-emerald-700 text-white p-4 text-center text-sm mt-8">
      &copy; {new Date().getFullYear()} My Wallet AT. All rights reserved.
    </footer>
  );
};
