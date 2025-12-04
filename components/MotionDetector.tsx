
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';

interface MotionDetectorProps {
  onMotionStart: () => void;
  onMotionEnd: () => void;
  isScanning: boolean;
}

export const MotionDetector: React.FC<MotionDetectorProps> = ({ onMotionStart, onMotionEnd, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameTime = useRef<number>(0);
  const lastImageData = useRef<Uint8ClampedArray | null>(null);
  const motionTimer = useRef<number | null>(null);
  const isCurrentlyMoving = useRef<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 320, 
                height: 240, 
                frameRate: 15,
                facingMode: 'user' 
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.warn("MotionDetector: Camera access denied or not available.", e);
      }
    };

    if (isScanning) {
      startStream();
    } else {
      // Stop stream if not scanning to save battery/privacy
      if (videoRef.current && videoRef.current.srcObject) {
         const s = videoRef.current.srcObject as MediaStream;
         s.getTracks().forEach(t => t.stop());
         videoRef.current.srcObject = null;
      }
    }

    const processFrame = (timestamp: number) => {
      if (!isScanning) return;
      
      // Throttle processing to ~10fps to save CPU
      if (timestamp - lastFrameTime.current < 100) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }
      lastFrameTime.current = timestamp;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas && video.readyState === 4) {
         const ctx = canvas.getContext('2d', { willReadFrequently: true });
         if (ctx) {
           const w = 50; // Downsample for performance
           const h = 50;
           ctx.drawImage(video, 0, 0, w, h);
           const imageData = ctx.getImageData(0, 0, w, h).data;
           
           if (lastImageData.current) {
             let diff = 0;
             // Sample every 4th pixel to save CPU
             for (let i = 0; i < imageData.length; i += 16) {
                // Compare Green channel (index 1)
                diff += Math.abs(imageData[i+1] - lastImageData.current[i+1]);
             }
             
             // Threshold calculation
             if (diff > 1500) { // Tuned threshold for general movement
                if (!isCurrentlyMoving.current) {
                  isCurrentlyMoving.current = true;
                  onMotionStart();
                }
                
                // Debounce stop
                if (motionTimer.current) window.clearTimeout(motionTimer.current);
                motionTimer.current = window.setTimeout(() => {
                  isCurrentlyMoving.current = false;
                  onMotionEnd();
                }, 400);
             }
           }
           lastImageData.current = imageData;
         }
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(processFrame);
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animationFrameId);
      if (motionTimer.current) clearTimeout(motionTimer.current);
    };
  }, [isScanning, onMotionStart, onMotionEnd]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="50" height="50" style={{ display: 'none' }} />
    </>
  );
};
