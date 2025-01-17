import React from "react";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/images/shark.png" alt="logo" className="h-14 w-12" />
            <div className="space-y-1">
              <h1>
                <span className="text-3xl font-bold text-gray-900">
                  plansky
                </span>{" "}
                <span> v0.1.1</span>
              </h1>
              <p className="text-gray-600 text-sm">
                KI-gestützte Raumlisten direkt aus Ihren CAD-Plänen
              </p>
            </div>
          </div>
          <img
            src="https://skale.dev/wp-content/uploads/2024/10/skalelogo_grey_trans-300x150.png"
            alt="Skale Logo"
            className="h-12 w-auto"
          />
        </div>
      </div>
    </header>
  );
}
