import { useState, useEffect } from 'react';

export function useGuidedTour() {
  const [shouldShowTour, setShouldShowTour] = useState(false);
  
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('guided_tour_completed');
    const hasSkippedTour = localStorage.getItem('guided_tour_skipped');
    
    // Mostrar tour apenas se nunca foi completado ou pulado
    if (!hasCompletedTour && !hasSkippedTour) {
      setShouldShowTour(true);
    }
  }, []);
  
  const completeTour = () => {
    localStorage.setItem('guided_tour_completed', 'true');
    localStorage.setItem('guided_tour_completed_at', new Date().toISOString());
    setShouldShowTour(false);
  };
  
  const skipTour = () => {
    localStorage.setItem('guided_tour_skipped', 'true');
    localStorage.setItem('guided_tour_skipped_at', new Date().toISOString());
    setShouldShowTour(false);
  };
  
  const resetTour = () => {
    localStorage.removeItem('guided_tour_completed');
    localStorage.removeItem('guided_tour_completed_at');
    localStorage.removeItem('guided_tour_skipped');
    localStorage.removeItem('guided_tour_skipped_at');
    setShouldShowTour(true);
  };
  
  return {
    shouldShowTour,
    completeTour,
    skipTour,
    resetTour,
  };
}