import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const BackgroundVideo = ({
  lightSrc = '/images/light-mode.mp4',
  darkSrc = '/images/dark-mode.mp4',
  overlayOpacity = 0.3
}) => {
  const [isDark, setIsDark] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;

    const checkTheme = () => {
      const dark = html.classList.contains('dark');
      setIsDark(dark);
      if (videoRef.current) {
        videoRef.current.playbackRate = dark ? 0.4 : 1.0; // Slow down for dark mode
      }
    };

    checkTheme(); // Initial check

    const observer = new MutationObserver(checkTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={isDark ? darkSrc : lightSrc}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />
    </div>
  );
};

BackgroundVideo.propTypes = {
  lightSrc: PropTypes.string,
  darkSrc: PropTypes.string,
  overlayOpacity: PropTypes.number
};

export default BackgroundVideo;
