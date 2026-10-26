import { useEffect, useRef, useState } from 'react';

export function CameraUploader({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s;
        if (video.current) video.current.srcObject = s;
      })
      .catch(() => setError('Camera unavailable — use gallery upload.'));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  function capture() {
    const v = video.current;
    if (!v) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(v, 0, 0);
    const url = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(url);
    onCapture(url);
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-[3/4]">
        {!preview && <video ref={video} autoPlay playsInline className="w-full h-full object-cover" />}
        {preview && <img src={preview} className="w-full h-full object-cover" alt="capture" />}
        <div className="pointer-events-none absolute inset-8 border border-sage/80 rounded-xl shadow-[0_0_0_1px_rgba(165,181,160,0.4)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-rose/70 animate-pulse" />
      </div>
      {error && <p className="text-xs text-rose">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={capture} className="flex-1 bg-charcoal text-white rounded-xl py-2 text-sm font-bold">Capture</button>
        <button type="button" onClick={() => setPreview(null)} className="px-4 rounded-xl border border-[#EBE5DF] text-sm font-bold">Retry</button>
      </div>
    </div>
  );
}
