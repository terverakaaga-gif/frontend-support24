
import React from 'react';

export const WaveLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-primary rounded-full animate-wave"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
    </div>
  </div>
);

export const PulseLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
	  {/* use my logo image */}
	  <div className="absolute inset-0 flex items-center justify-center">
		<img src="/favicon.svg" alt="Logo" className="w-6 h-6 animate-pulse" />
	  </div>
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full animate-pulse"></div> */}
    </div>
  </div>
);

export const BounceLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex space-x-1">
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// Main loader component that can switch between types
interface LoaderProps {
  type?: 'wave' | 'pulse' | 'bounce';
}

const Loader: React.FC<LoaderProps> = ({ type = 'pulse' }) => {
  switch (type) {
    case 'pulse':
      return <PulseLoader />;
    case 'bounce':
      return <BounceLoader />;
    case 'wave':
    default:
      return <WaveLoader />;
  }
};

export default Loader;