'use client';
import { useState } from "react";
import CoolDropdown from "./components/CoolDropdown";

const LARACONS = [
  { id: 'denver', name: 'Denver, USA' },
  { id: 'brisbane', name: 'Brisbane, Australia' },
  { id: 'amsterdam', name: 'Amsterdam, Netherlands' },
  { id: 'gandhinagar', name: 'Gandhinagar, India' },
];

export default function Home() {
  const [location, setLocation] = useState<string | null>(null);

  const selectedLocationName = LARACONS.find(s => s.id === location)?.name;

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <CoolDropdown 
        location={location} 
        setLocation={setLocation} 
        selectedLocationName={selectedLocationName} 
        laracons={LARACONS}
      />
    </div>
  );
}