import { useCallback, useEffect, useState } from "react"

export const useMicrophone = () => {
    const [recording, setRecording] = useState(false);
    const [track, setTrack] = useState(null);
    const [mic, setMic] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const initMic = useCallback( async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaRecorder(new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            }));
            setMic(true);
        }
        catch {
            setMic(false);
        }
    }, []);

    const start = useCallback(() => {
        mediaRecorder.start();
    }, [mediaRecorder]);

    const stop = useCallback(() => {
        mediaRecorder.stop();
    }, [mediaRecorder]);

    useEffect(initMic, [initMic]);

    useEffect( () => {
        if ( !mediaRecorder ) return;

        mediaRecorder.onstart = () => {
            if ( mediaRecorder.state === 'recording' ) setRecording(true);
        }

        mediaRecorder.onstop = () => {
            if ( mediaRecorder.state === 'inactive' ) setRecording(false);
        }

        mediaRecorder.ondataavailable = event => {
            setTrack(event.data);
        }
    }, [mediaRecorder, setRecording, setTrack]);

    return { recording, track, mic, start, stop }
}