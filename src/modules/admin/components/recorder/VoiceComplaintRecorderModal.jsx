import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Mic, Square, X, RotateCcw } from 'lucide-react';
import * as Yup from 'yup';

const MAX_DURATION_SECONDS = 60;
const WAVE_BAR_COUNT = 32;

const TEXT = {
  en: {
    title: 'Voice Complaint',
    number: 'Number',
    numberPlaceholder: 'Enter your number',
    record: 'Record',
    stop: 'Stop',
    rerecord: 'Record Again',
    submit: 'টিকেট করুন',
    close: 'Close',
    timer: 'Time left',
    limit: 'Maximum recording time: 60 seconds',
    attached: 'Voice recording is ready to attach',
    audioRequired: 'Please record your complaint first.',
    numberRequired: 'Please enter your 11-digit number.',
    notSupported: 'Your browser does not support voice recording.',
    permissionError: 'Microphone permission is required to record.',
  },
  bn: {
    title: 'ভয়েস অভিযোগ',
    number: 'নম্বর',
    numberPlaceholder: 'আপনার নম্বর লিখুন',
    record: 'রেকর্ড করুন',
    stop: 'স্টপ',
    rerecord: 'আবার রেকর্ড করুন',
    submit: 'টিকেট করুন',
    close: 'বন্ধ করুন',
    timer: 'বাকি সময়',
    limit: 'সর্বোচ্চ রেকর্ডিং সময়: ৬০ সেকেন্ড',
    attached: 'ভয়েস রেকর্ড সংযুক্ত করার জন্য প্রস্তুত',
    audioRequired: 'দয়া করে আগে আপনার অভিযোগ রেকর্ড করুন।',
    numberRequired: '১১ সংখ্যার মোবাইল নম্বর দিন।',
    notSupported: 'আপনার ব্রাউজার ভয়েস রেকর্ডিং সাপোর্ট করে না।',
    permissionError: 'রেকর্ড করার জন্য মাইক্রোফোন অনুমতি প্রয়োজন।',
  },
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

const stopStreamTracks = (stream) => {
  stream?.getTracks()?.forEach((track) => track.stop());
};

const interleaveChannels = (channelData) => {
  if (channelData.length === 1) {
    return channelData[0];
  }

  const totalLength = channelData[0].length * channelData.length;
  const interleaved = new Float32Array(totalLength);

  for (let sampleIndex = 0; sampleIndex < channelData[0].length; sampleIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelData.length; channelIndex += 1) {
      interleaved[(sampleIndex * channelData.length) + channelIndex] =
        channelData[channelIndex][sampleIndex];
    }
  }

  return interleaved;
};

const encodeWav = (audioBuffer) => {
  const channelData = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
    audioBuffer.getChannelData(index)
  );
  const interleaved = interleaveChannels(channelData);
  const bytesPerSample = 2;
  const blockAlign = audioBuffer.numberOfChannels * bytesPerSample;
  const byteRate = audioBuffer.sampleRate * blockAlign;
  const dataLength = interleaved.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, audioBuffer.numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < interleaved.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += bytesPerSample;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

const convertBlobToWav = async (blob) => {
  if (!blob || blob.size === 0) {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('AudioContext is not supported');
  }

  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContextClass();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return encodeWav(audioBuffer);
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close();
    }
  }
};

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }

  const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];

  return mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || '';
};

const recorderNumberValidationSchema = Yup.object({
  number: Yup.string().required('required').matches(/^\d{11}$/, 'invalid'),
});

export const VoiceComplaintRecorderModal = ({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  isEnglish,
  initialNumber = '',
}) => {
  const t = isEnglish ? TEXT.en : TEXT.bn;
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_SECONDS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [waveBars, setWaveBars] = useState(Array.from({ length: WAVE_BAR_COUNT }, () => 20));
  const hasRecordingView = isRecording || !!recordedBlob;
  const numberFormik = useFormik({
    initialValues: {
      number: initialNumber || '',
    },
    enableReinitialize: true,
    validationSchema: recorderNumberValidationSchema,
    onSubmit: () => {},
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const countdownRef = useRef(null);

  const resetWaveBars = () => {
    setWaveBars(Array.from({ length: WAVE_BAR_COUNT }, () => 20));
  };

  const clearRecorderResources = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    analyserRef.current?.disconnect?.();
    analyserRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;

    stopStreamTracks(streamRef.current);
    streamRef.current = null;
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      return;
    }

    clearRecorderResources();
    setIsRecording(false);
    resetWaveBars();
  };

  useEffect(() => {
    if (!show) {
      stopRecording();
      setTimeLeft(MAX_DURATION_SECONDS);
      setRecordedBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl('');
      setError('');
      numberFormik.setFieldValue('number', initialNumber || '', false);
      numberFormik.setTouched({ number: false }, false);
      resetWaveBars();
      return;
    }

    numberFormik.setFieldValue('number', initialNumber || '', false);
    numberFormik.setTouched({ number: false }, false);
    setError('');
  }, [show, initialNumber]);

  useEffect(() => {
    return () => {
      clearRecorderResources();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const animateWaveform = () => {
    if (!analyserRef.current) {
      return;
    }

    const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(buffer);

    const segmentSize = Math.max(1, Math.floor(buffer.length / WAVE_BAR_COUNT));
    const nextBars = Array.from({ length: WAVE_BAR_COUNT }, (_, index) => {
      const start = index * segmentSize;
      const end = Math.min(buffer.length, start + segmentSize);

      let total = 0;
      for (let i = start; i < end; i += 1) {
        total += buffer[i];
      }

      const average = total / Math.max(1, end - start);
      return Math.max(14, Math.min(100, 14 + average / 3));
    });

    setWaveBars(nextBars);
    animationFrameRef.current = requestAnimationFrame(animateWaveform);
  };

  const startRecording = async () => {
    setError('');
    numberFormik.setTouched({ number: true }, false);

    const numberValidationErrors = await numberFormik.validateForm();
    if (numberValidationErrors.number) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError(t.notSupported);
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      setError(t.notSupported);
      return;
    }

    try {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setRecordedBlob(null);
      setAudioUrl('');
      setTimeLeft(MAX_DURATION_SECONDS);
      resetWaveBars();
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        animateWaveform();
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blobType = mediaRecorder.mimeType || mimeType || 'audio/webm';
        const sourceBlob = new Blob(audioChunksRef.current, { type: blobType });

        clearRecorderResources();
        setIsRecording(false);
        setTimeLeft(MAX_DURATION_SECONDS);
        mediaRecorderRef.current = null;

        if (sourceBlob.size > 0) {
          try {
            const nextBlob = await convertBlobToWav(sourceBlob);

            if (!nextBlob || nextBlob.size === 0) {
              throw new Error('Empty WAV output');
            }

            const nextAudioUrl = URL.createObjectURL(nextBlob);
            setRecordedBlob(nextBlob);
            setAudioUrl(nextAudioUrl);
            setWaveBars(Array.from({ length: WAVE_BAR_COUNT }, (_, index) => 36 + ((index % 5) * 7)));
          } catch (conversionError) {
            setRecordedBlob(null);
            setAudioUrl('');
            resetWaveBars();
            setError(t.notSupported);
          }
        } else {
          setRecordedBlob(null);
          setAudioUrl('');
          resetWaveBars();
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      countdownRef.current = setInterval(() => {
        setTimeLeft((current) => {
          if (current <= 1) {
            stopRecording();
            return 0;
          }

          return current - 1;
        });
      }, 1000);
    } catch (recorderError) {
      clearRecorderResources();
      setIsRecording(false);
      setRecordedBlob(null);
      setAudioUrl('');
      resetWaveBars();
      setError(t.permissionError);
    }
  };

  const handleSubmit = async () => {
    setError('');
    const number = numberFormik.values.number.trim();
    numberFormik.setTouched({ number: true }, false);

    if (!/^\d{11}$/.test(number)) {
      return;
    }

    if (!recordedBlob) {
      setError(t.audioRequired);
      return;
    }

    const file = new File([recordedBlob], `voice-complaint-${Date.now()}.wav`, {
      type: recordedBlob.type || 'audio/wav',
    });

    await onSubmit({
      number,
      file,
    });
  };

  if (!show) {
    return null;
  }

  return (
    <div className="voice-recorder-modal-backdrop" role="dialog" aria-modal="true">
      <div className="voice-recorder-modal-card">
        <div className="voice-recorder-modal-header">
          <div>
            <h5 className="mb-1">{t.title}</h5>
            <small className="text-muted">{t.limit}</small>
          </div>
          <button type="button" className="voice-recorder-icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="voice-recorder-input-row mb-3">
          <div className="voice-recorder-input-column">
            <input
              type="text"
              className="form-control"
              value={numberFormik.values.number}
              placeholder={t.numberPlaceholder}
              onChange={(event) => {
                numberFormik.setFieldValue(
                  'number',
                  event.target.value.replace(/[^\d]/g, '').slice(0, 11),
                  false
                );
              }}
            />
            {numberFormik.touched.number && numberFormik.errors.number ? (
              <div className="text-danger small mt-1">{t.numberRequired}</div>
            ) : null}
          </div>

          {!hasRecordingView ? (
            <button
              type="button"
              className="voice-recorder-action-button record voice-recorder-record-button"
              onClick={startRecording}
            >
              <Mic size={18} />
              <span>{t.record}</span>
            </button>
          ) : null}
        </div>

        {!hasRecordingView ? null : (
          <>
            <div className="voice-recorder-status-row">
              <span>{t.timer}</span>
              <strong className={isRecording ? 'text-danger' : ''}>{formatTime(timeLeft)}</strong>
            </div>

            <div className={`voice-recorder-wave-shell ${isRecording ? 'is-recording' : ''}`}>
              <div className="voice-recorder-wave-bars">
                {waveBars.map((barHeight, index) => (
                  <span
                    key={index}
                    className="voice-recorder-wave-bar"
                    style={{ height: `${barHeight}%` }}
                  ></span>
                ))}
              </div>
            </div>

            <div className="voice-recorder-controls centered">
              {isRecording ? (
                <button
                  type="button"
                  className="voice-recorder-action-button stop"
                  onClick={stopRecording}
                >
                  <Square size={18} />
                  <span>{t.stop}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="voice-recorder-action-button retry"
                  onClick={startRecording}
                >
                  <RotateCcw size={18} />
                  <span>{t.rerecord}</span>
                </button>
              )}
            </div>
          </>
        )}

        {recordedBlob && !isRecording && (
          <div className="voice-recorder-preview">
            <div className="voice-recorder-preview-label">{t.attached}</div>
            <audio controls src={audioUrl} className="w-100" />
          </div>
        )}

        {error ? <div className="text-danger small mt-2">{error}</div> : null}

        {recordedBlob && !isRecording ? (
          <div className="voice-recorder-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.close}
            </button>
            <button
              type="button"
              className="custom-btn-for-canvas"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <i className="bi bi-send me-1"></i>
              {t.submit}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};