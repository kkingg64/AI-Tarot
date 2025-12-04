
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useRef, useEffect } from 'react';

interface MotionDetectorProps {
  onMotion: (level: number) => void;
  active: boolean;
  className?: string;
}

export const MotionDetector: React.FC<MotionDetectorProps> = ({ onMotion, active, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [active]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        detectMotion();
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const detectMotion = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Use a small processing size for performance
    const width = 64; 
    const height = 48;
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const processFrame = () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
         animationRef.current = requestAnimationFrame(processFrame);
         return;
      }

      ctx.drawImage(videoRef.current, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;
      const length = data.length;

      if (prevFrameRef.current) {
        let diff = 0;
        // Compare pixels (RGBA, step by 4)
        for (let i = 0; i < length; i += 4) {
           // Simple grayscale diff
           const rDiff = Math.abs(data[i] - prevFrameRef.current[i]);
           const gDiff = Math.abs(data[i+1] - prevFrameRef.current[i+1]);
           const bDiff = Math.abs(data[i+2] - prevFrameRef.current[i+2]);
           
           if (rDiff + gDiff + bDiff > 50) { // Threshold
             diff++;
           }
        }
        
        // Normalize motion level (0 to 10 approx)
        const motionLevel = Math.min((diff / (width * height)) * 100, 20);
        if (motionLevel > 0.5) {
             onMotion(motionLevel);
        }
      }

      // Clone current frame data for next iteration
      prevFrameRef.current = new Uint8ClampedArray(data);
      animationRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  return (
    <>
      <video 
        ref={videoRef} 
        className={`${className} scale-x-[-1]`} // Mirror effect
        muted 
        playsInline 
      />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};
