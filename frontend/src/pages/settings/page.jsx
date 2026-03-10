import { LuConstruction } from 'react-icons/lu';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="bg-gray-800/30 p-10 rounded-full mb-8">
        <LuConstruction size={80} className="text-gray-600 animate-pulse" />
      </div>
      <h2 className="text-4xl font-bold mb-4">Under Construction</h2>
      <p className="text-gray-500 text-xl max-w-md">
        We are building the advanced settings module. Soon you will be able to manage your 
        API keys, billing, and global model preferences here.
      </p>
    </div>
  );
}