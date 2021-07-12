import { useCallback, useEffect, useRef, useState } from "react"

export const useMicrophone = () => {
    const mediaRecorder = useRef();
    const [recording, setRecording] = useState(false);
    const [track, setTrack] = useState(null);
    const [mic, setMic] = useState(false);

    const start = useCallback(() => {
        mediaRecorder.current.start();
    }, [mediaRecorder]);

    const stop = useCallback(() => {
        mediaRecorder.current.stop();
    }, [mediaRecorder]);

    useEffect(() => {
        if ( Boolean(mic) ) return;
        async function initMic() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorder.current.onstart = () => {
                    if ( mediaRecorder.current.state === 'recording' ) setRecording(true);
                }
                mediaRecorder.current.onstop = () => {
                    if ( mediaRecorder.current.state === 'inactive' ) setRecording(false);
                }
                mediaRecorder.current.ondataavailable = event => setTrack(event.data);
                setMic(true);
            }
            catch {
                setMic(false);
            }
        }
        initMic();
    });

    return { recording, track, mic, start, stop }
}