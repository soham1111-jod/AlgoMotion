import { useState, useCallback, useRef, useEffect } from 'react';

export default function useAlgorithm() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const timerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      console.log('Clearing animation timer');
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const generateSteps = useCallback((algorithm, data) => {
    try {
      console.log('Generating steps for algorithm:', algorithm.name || 'unknown');
      
      if (!data && !Array.isArray(data) && typeof data !== 'object') {
        console.error('Invalid input data for algorithm');
        return false;
      }
      
      const newSteps = algorithm(data);
      
      if (Array.isArray(newSteps) && newSteps.length > 0) {
        console.log(`Generated ${newSteps.length} steps successfully`);
        setSteps(newSteps);
        setCurrentStep(0);
        return true;
      } else {
        console.error('Algorithm did not return valid steps array');
        return false;
      }
    } catch (error) {
      console.error('Error generating algorithm steps:', error);
      return false;
    }
  }, []);

  const play = useCallback(() => {
    console.log('Play called:', { currentStep, stepsLength: steps.length });
    
    if (!steps || steps.length === 0) {
      console.error('No steps available to play');
      return;
    }
    
    // Reset if at the end
    if (currentStep >= steps.length - 1) {
      console.log('Resetting to beginning before playing');
      setCurrentStep(0);
    }
    
    console.log('Setting isPlaying to true');
    setIsPlaying(true);
    isAnimatingRef.current = true;
  }, [currentStep, steps]);

  const pause = useCallback(() => {
    console.log('Pause called');
    setIsPlaying(false);
    isAnimatingRef.current = false;
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    console.log('Reset called');
    setIsPlaying(false);
    isAnimatingRef.current = false;
    clearTimer();
    setCurrentStep(0);
  }, [clearTimer]);

  const nextStep = useCallback(() => {
    console.log('Next step called:', { currentStep, stepsLength: steps.length });
    clearTimer();
    setIsPlaying(false);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps, clearTimer]);

  const prevStep = useCallback(() => {
    console.log('Previous step called:', { currentStep });
    clearTimer();
    setIsPlaying(false);
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, clearTimer]);

  // Animation effect
  useEffect(() => {
    console.log('Animation effect running:', { 
      isPlaying, 
      currentStep, 
      stepsLength: steps?.length || 0,
      hasTimer: !!timerRef.current
    });
    
    if (!isPlaying || !steps || steps.length === 0) {
      console.log('Not playing or no steps, skipping animation');
      return;
    }
    
    // If we've reached the end, stop playing
    if (currentStep >= steps.length - 1) {
      console.log('Reached end of steps, stopping animation');
      setIsPlaying(false);
      isAnimatingRef.current = false;
      clearTimer();
      return;
    }
    
    // Calculate delay based on speed
    const delay = Math.max(50, 2050 - speed);
    console.log(`Setting up next step with delay: ${delay}ms`);
    
    // Clear any existing timer
    clearTimer();
    
    // Set up the next step
    timerRef.current = setTimeout(() => {
      if (isAnimatingRef.current) {
        console.log(`Advancing from step ${currentStep} to ${currentStep + 1}`);
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          // Double check we haven't reached the end
          if (nextStep >= steps.length) {
            setIsPlaying(false);
            isAnimatingRef.current = false;
            return prev;
          }
          return nextStep;
        });
      }
    }, delay);
    
    // Cleanup function
    return () => {
      clearTimer();
    };
  }, [isPlaying, currentStep, steps, speed, clearTimer]);

  return {
    isPlaying,
    speed,
    currentStep,
    steps,
    generateSteps,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setSpeed,
    setCurrentStep,
    timerRef
  };
}