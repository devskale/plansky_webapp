import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Partner: <span className="font-semibold">
              <img
                src="/images/sharkbau-end-plain-svg.png"
                alt="sharkbau Logo"
                className="h-6 w-auto inline filter grayscale contrast-[1]"
                //className="h-6 w-auto inline bg-gray-800 filter invert "
              />
            </span>
          </p>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} plansky by skale.dev.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

