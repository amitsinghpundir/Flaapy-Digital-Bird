
import React from 'react';
import { PIPE_WIDTH } from '../constants';

interface PipeProps {
  x: number;
  gapY: number;
  gap: number;
}

const Pipe: React.FC<PipeProps> = ({ x, gapY, gap }) => {
  return (
    <div className="absolute" style={{ left: `${x}px`, top: 0, bottom: 0, width: `${PIPE_WIDTH}px` }}>
      {/* Top Pipe */}
      <div 
        className="absolute left-0 top-0 w-full bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.7)]"
        style={{ height: `${gapY}px` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-8 bg-gray-800 border-x-4 border-b-4 border-lime-400 rounded-b-lg"></div>
      </div>
      {/* Bottom Pipe */}
      <div 
        className="absolute left-0 w-full bg-gradient-to-t from-gray-700 to-gray-800 border-4 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.7)]"
        style={{ top: `${gapY + gap}px`, bottom: 0 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-8 bg-gray-800 border-x-4 border-t-4 border-lime-400 rounded-t-lg"></div>
      </div>
    </div>
  );
};

export default Pipe;
