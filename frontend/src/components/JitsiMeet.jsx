import { useEffect, useRef } from 'react';

// Embeds the Jitsi Meet External API (https://meet.jit.si) into a React view.
// Loads the external_api.js script once and mounts a JitsiMeetExternalAPI
// instance with the provided room name.
export default function JitsiMeet({ roomName, displayName = 'User' }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    if (!roomName) return;

    // Load the external API script if it is not present yet.
    function loadScript() {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) return resolve();
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi API'));
        document.body.appendChild(script);
      });
    }

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false
          }
        });
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, displayName]);

  return <div className="video-box" ref={containerRef} />;
}
