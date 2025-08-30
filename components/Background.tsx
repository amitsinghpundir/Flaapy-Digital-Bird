
import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  gameSpeed?: number;
}

const Background: React.FC<BackgroundProps> = ({ gameSpeed = 0 }) => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const positionX1 = useRef(0);
  const positionX2 = useRef(0);
  const gameSpeedRef = useRef(gameSpeed);
  
  // Update ref when prop changes, so the animation loop has the latest value
  useEffect(() => {
    gameSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  useEffect(() => {
    // Only run the animation loop if we have a speed
    if (gameSpeed <= 0) return;

    let animationFrameId: number;

    const animate = () => {
      const currentSpeed = gameSpeedRef.current;
      
      // Farther stars, move slower. Speed is multiplied by a small factor.
      positionX1.current -= currentSpeed * 0.25;
      // Closer stars, move faster. Speed is multiplied by a larger factor.
      positionX2.current -= currentSpeed * 0.5;

      // Update background position. Using 'repeat' makes the tiling seamless.
      if (layer1Ref.current) {
          layer1Ref.current.style.backgroundPositionX = `${positionX1.current}px`;
      }
      if (layer2Ref.current) {
          layer2Ref.current.style.backgroundPositionX = `${positionX2.current}px`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // This effect runs only when the game starts or stops playing.
  }, [gameSpeed > 0]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Layer 1: Slower, distant stars */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 opacity-50 stars"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'none\' /%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'0.5\' fill=\'white\' /%3E%3Ccircle cx=\'10\' cy=\'20\' r=\'0.5\' fill=\'white\' /%3E%3Ccircle cx=\'90\' cy=\'80\' r=\'0.5\' fill=\'white\' /%3E%3Ccircle cx=\'30\' cy=\'70\' r=\'0.5\' fill=\'white\' /%3E%3Ccircle cx=\'70\' cy=\'30\' r=\'0.5\' fill=\'white\' /%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      ></div>
      {/* Layer 2: Faster, closer stars */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 opacity-30 stars"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'none\' /%3E%3Ccircle cx=\'5\' cy=\'5\' r=\'1\' fill=\'cyan\' /%3E%3Ccircle cx=\'80\' cy=\'50\' r=\'1\' fill=\'cyan\' /%3E%3Ccircle cx=\'40\' cy=\'90\' r=\'1\' fill=\'cyan\' /%3E%3C/svg%3E")',
          backgroundSize: '300px 300px',
          backgroundRepeat: 'repeat',
        }}
      ></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
    </div>
  );
};

export default Background;