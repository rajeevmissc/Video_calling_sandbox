import { useEffect } from 'react';

/**
 * Custom hook to manage navigation, fullscreen, and browser back button
 */
export const useCallNavigation = ({
  callEnded,
  callConnected,
  isWaitingForProvider,
  remoteUsersLength,
  setShowExitConfirmation
}) => {
  // Full-screen mode (hide header/footer)
  useEffect(() => {
    document.body.classList.add("call-active");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const nav = document.querySelector("nav");
    
    const originalStyles = {
      header: header?.style.display,
      footer: footer?.style.display,
      nav: nav?.style.display,
    };
    
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (nav) nav.style.display = "none";
    
    return () => {
      document.body.classList.remove("call-active");
      if (header) header.style.display = originalStyles.header;
      if (footer) footer.style.display = originalStyles.footer;
      if (nav) nav.style.display = originalStyles.nav;
    };
  }, []);

  // Prevent browser back button during active call
  useEffect(() => {
    const isCallActive =
      !callEnded &&
      (callConnected || isWaitingForProvider || remoteUsersLength > 0);

    const handlePopState = () => {
      if (isCallActive) {
        window.history.pushState(null, "", window.location.pathname);
        setShowExitConfirmation(true);
      }
    };

    if (isCallActive) {
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [callEnded, callConnected, isWaitingForProvider, remoteUsersLength, setShowExitConfirmation]);
};