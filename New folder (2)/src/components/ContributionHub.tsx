import React, { useState, useRef, useEffect } from 'react';
import { Contribution, RegionId, CategoryId } from '../types';
import { PlusCircle, Clock, Send, Sparkles, CheckCircle, User, MapPin, Tag, X, FileText, Link as LinkIcon, Upload, HardDrive, Image as ImageIcon, Music, Video, Smartphone, Trash2, Check, Flag, AlertTriangle, Mic, Square, Play, Pause, Volume2 } from 'lucide-react';

interface ContributionHubProps {
  contributions: Contribution[];
  onSubmitContribution: (newContrib: Omit<Contribution, 'id' | 'createdAt'>) => void;
  onRemoveContribution?: (id: string) => void;
  onReportContribution?: (id: string, title: string, reason: string, details?: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
  defaultRegion?: RegionId;
  defaultCategory?: CategoryId;
}

export const ContributionHub: React.FC<ContributionHubProps> = ({
  contributions,
  onSubmitContribution,
  onRemoveContribution,
  onReportContribution,
  isOpenModal,
  onCloseModal,
  defaultRegion = 'eastern',
  defaultCategory = 'kissa'
}) => {
  const [reportTarget, setReportTarget] = useState<Contribution | null>(null);
  const [reportReason, setReportReason] = useState<string>('Hate Speech or Harassment');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [reportAlsoHide, setReportAlsoHide] = useState<boolean>(true);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<Contribution | null>(null);
  const [formData, setFormData] = useState({
    contributorName: '',
    region: defaultRegion,
    category: defaultCategory,
    title: '',
    description: '',
    mediaUrl: ''
  });

  const [importSource, setImportSource] = useState<'audio' | 'mic' | 'desktop' | 'gallery' | 'drive' | 'url'>('audio');
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    type: 'image' | 'audio' | 'video' | 'other';
    size: string;
    previewUrl: string;
  } | null>(null);

  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startVoiceRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        alert('Microphone recording is not supported by your current browser or connection (requires secure context / supported browser). You can still upload MP3/WAV/OGG audio files directly!');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const kbSize = (audioBlob.size / 1024).toFixed(1);
          setFileDetails({
            name: `Live_Voice_Recording_${Date.now().toString().slice(-4)}.webm`,
            type: 'audio',
            size: `${kbSize} KB`,
            previewUrl: dataUrl
          });
          setFormData((prev) => ({ ...prev, mediaUrl: dataUrl }));
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone permission is required to record audio. Please allow microphone access in your browser settings.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Filter logic for 7-day auto-expiry ticker
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const recentContributions = contributions.filter(
    (c) => now - c.createdAt <= SEVEN_DAYS_MS
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let mediaType: 'image' | 'audio' | 'video' | 'other' = 'other';
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';
    else if (file.type.startsWith('video/')) mediaType = 'video';

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFileDetails({
        name: file.name,
        type: mediaType,
        size: `${fileSizeMb} MB`,
        previewUrl: dataUrl
      });
      setFormData((prev) => ({ ...prev, mediaUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleProcessDriveLink = () => {
    if (!driveUrlInput.trim()) return;
    let processed = driveUrlInput.trim();

    // Transform Google Drive shareable link to embeddable view URL if applicable
    const driveMatch = processed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      processed = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    setFileDetails({
      name: 'Google Drive Imported File',
      type: processed.match(/\.(mp3|wav|ogg|m4a|aac)$/i) ? 'audio' : processed.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
      size: 'Cloud Drive Link',
      previewUrl: processed
    });

    setFormData((prev) => ({ ...prev, mediaUrl: processed }));
  };

  const handleClearFile = () => {
    setFileDetails(null);
    setDriveUrlInput('');
    setFormData((prev) => ({ ...prev, mediaUrl: '' }));
    if (desktopInputRef.current) desktopInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (isRecording) stopVoiceRecording();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contributorName || !formData.title) return;

    const isAudioType = fileDetails?.type === 'audio' ||
      (formData.mediaUrl ? (formData.mediaUrl.startsWith('data:audio') || formData.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i) !== null) : false);

    onSubmitContribution({
      contributorName: formData.contributorName,
      region: formData.region as RegionId,
      category: formData.category as CategoryId,
      title: formData.title,
      description: formData.description.trim() || 'Shared community contribution.',
      mediaUrl: formData.mediaUrl || undefined,
      audioUrl: isAudioType ? formData.mediaUrl : undefined,
      mediaType: isAudioType ? 'audio' : fileDetails?.type
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onCloseModal();
      handleClearFile();
      setFormData({
        contributorName: '',
        region: 'eastern',
        category: 'kissa',
        title: '',
        description: '',
        mediaUrl: ''
      });
    }, 1800);
  };

  const getRelativeTime = (timestamp: number) => {
    const diffHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <section id="contribute" className="py-20 bg-[#F5E6D3] border-b-2 border-[#2D1E18]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1E18] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Community Contribution Hub</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D1E18]">
            Keep the Oral Flame Alive
          </h2>
          <p className="text-sm sm:text-base text-[#4A3B34]">
            Share a folk tale, traditional recipe, song, pattern motif, or proverb from your elders. Every submission is preserved in the digital archive.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  region: defaultRegion,
                  category: defaultCategory
                }));
              }}
              className="relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C05A3E] via-[#D4AF37] to-[#C05A3E] text-white font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(192,90,62,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[#FFF8DC]/20"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span>+ Submit Cultural Memory</span>
            </button>
          </div>
        </div>

        {/* Recent Contributions Ticker Feed (Items <= 7 days old) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2D1E18]/15 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-[#2D1E18]/15 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C05A3E]" />
              <h3 className="font-serif text-xl font-bold text-[#2D1E18]">
                Recent Contributions (Last 7 Days)
              </h3>
            </div>
            <span className="text-xs text-[#2D1E18] font-bold bg-[#FAF4EB] px-2.5 py-1 rounded border border-[#2D1E18]/15">
              {recentContributions.length} Active Submissions
            </span>
          </div>

          {recentContributions.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#4A3B34] italic bg-[#FAF4EB] rounded p-4 border border-dashed border-[#C05A3E]/30">
              No new submissions in the last 7 days. Be the first to contribute this week!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentContributions.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF4EB] rounded-lg p-5 border border-[#2D1E18]/15 hover:border-[#C05A3E] transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#2D1E18] font-bold uppercase tracking-wider mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#2D1E18] text-[#D4AF37]">
                        {item.region === 'all' ? 'All Regions' : `${item.region} Balochistan`} • {item.category.replace('_', ' ')}
                      </span>
                      <span className="text-[#4A3B34] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C05A3E]" />
                        {getRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#2D1E18] mb-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#4A3B34] line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Media Audio / Image rendering */}
                    {(item.audioUrl || item.mediaType === 'audio' || (item.mediaUrl && (item.mediaUrl.startsWith('data:audio') || item.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i) !== null))) ? (
                      <div className="mt-3 p-2 rounded-lg bg-white border border-[#2D1E18]/15">
                        <div className="text-[10px] font-bold text-[#C05A3E] mb-1 flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          <span>Audio Track:</span>
                        </div>
                        <audio controls src={item.audioUrl || item.mediaUrl} className="w-full h-8 rounded" />
                      </div>
                    ) : item.mediaUrl ? (
                      <div className="mt-3 rounded-lg overflow-hidden border border-[#2D1E18]/15 aspect-[16/9] bg-[#1A100C]">
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#2D1E18]/10 flex items-center justify-between text-[11px] text-[#4A3B34]">
                    <span className="flex items-center gap-1 font-semibold text-[#2D1E18]">
                      <User className="w-3 h-3 text-[#C05A3E]" />
                      {item.contributorName}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setReportTarget(item);
                          setReportReason('Hate Speech or Harassment');
                          setReportDetails('');
                          setReportAlsoHide(true);
                          setReportSubmitted(false);
                        }}
                        className="p-1 rounded text-[#2D1E18]/40 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                        title="Report Harmful Content"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1 rounded text-[#2D1E18]/40 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Remove Contribution"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] bg-[#C05A3E] text-white px-2 py-0.5 rounded font-bold ml-1">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Interactive Submission Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6">
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 p-2 rounded bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410]"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-[#C05A3E] mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-[#2D1E18]">
                  Contribution Recorded!
                </h3>
                <p className="text-xs text-[#4A3B34] max-w-md mx-auto">
                  Thank you for preserving Baloch culture. Your contribution has been added to the regional archive and recent submissions ticker.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#2D1E18]/15 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D1E18] text-[#D4AF37] text-xs font-bold uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Gulzameen Digital Archive
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#2D1E18]">
                    Contribute a Cultural Story
                  </h3>
                  <p className="text-xs text-[#4A3B34] mt-1">
                    Fill in the details below to add a new story, recipe, song, pattern, or proverb to the community repository.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contributor Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                      Your Name / Elder's Credit <span className="text-[#C05A3E]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#C05A3E] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.contributorName}
                        onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                        placeholder="e.g. Mir Baloch / Grandma Zohra"
                        className="w-full bg-white border border-[#2D1E18]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                      Region <span className="text-[#C05A3E]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#C05A3E] absolute left-3 top-3" />
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionId })}
                        className="w-full bg-white border border-[#2D1E18]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                      >
                        <option value="eastern">Eastern Balochistan</option>
                        <option value="western">Western Balochistan</option>
                        <option value="southern">Southern Balochistan</option>
                        <option value="all">All Regions (Pan-Balochistan / All 3 Regions)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                      Category <span className="text-[#C05A3E]">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-[#C05A3E] absolute left-3 top-3" />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                        className="w-full bg-white border border-[#2D1E18]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                      >
                        <option value="kissa">Folk Stories (Kissa)</option>
                        <option value="saoth">Traditional Music (Saoth)</option>
                        <option value="recipes">Traditional Recipes</option>
                        <option value="baloch_duch">Traditional Embroidery (Baloch Duch)</option>
                        <option value="bathal">Proverbs / Sayings (Bathal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                      Title of Item <span className="text-[#C05A3E]">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-[#C05A3E] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Tale of Mir Lelo / Secret Sajji Spice Blend"
                        className="w-full bg-white border border-[#2D1E18]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#2D1E18] uppercase tracking-wider">
                      Description & Narrative <span className="text-[#4A3B34] font-normal text-[11px] lowercase">(optional)</span>
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Write the story, recipe ingredients, song lyrics, embroidery technique, or proverb meaning (optional)..."
                    className="w-full bg-white border border-[#2D1E18]/20 rounded p-3 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                  />
                </div>

                {/* Multi-Source Media Importer (Audio File, Voice Recorder, Desktop, Gallery, Google Drive, Direct Link) */}
                <div className="bg-white p-4 rounded-xl border border-[#2D1E18]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#2D1E18] uppercase tracking-wider">
                      Attach Media (Audio Recording, MP3, Video, or Photo) <span className="text-[#4A3B34] font-normal text-[11px] lowercase">(optional)</span>
                    </label>
                    <span className="text-[10px] text-[#C05A3E] font-semibold">
                      Audio • Voice • Files • Drive • Link
                    </span>
                  </div>

                  {/* Source Selector Tabs */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-[#F9F4EE] rounded-lg border border-[#2D1E18]/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setImportSource('audio')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'audio'
                          ? 'bg-[#C05A3E] text-white shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>Audio File</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportSource('mic')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'mic'
                          ? 'bg-[#C05A3E] text-white shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Mic Record</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportSource('desktop')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'desktop'
                          ? 'bg-[#2D1E18] text-[#D4AF37] shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportSource('gallery')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'gallery'
                          ? 'bg-[#2D1E18] text-[#D4AF37] shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Gallery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportSource('drive')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'drive'
                          ? 'bg-[#2D1E18] text-[#D4AF37] shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Drive</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImportSource('url')}
                      className={`py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
                        importSource === 'url'
                          ? 'bg-[#2D1E18] text-[#D4AF37] shadow-sm'
                          : 'text-[#2D1E18]/70 hover:text-[#2D1E18]'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Web Link</span>
                    </button>
                  </div>

                  {/* Input Panels Based on Active Source */}
                  {fileDetails ? (
                    <div className="p-3 bg-[#FAF4EB] rounded-lg border border-[#C05A3E]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded bg-[#2D1E18] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                            {fileDetails.type === 'audio' && <Music className="w-5 h-5 text-[#D4AF37]" />}
                            {fileDetails.type === 'video' && <Video className="w-5 h-5" />}
                            {fileDetails.type === 'image' && <ImageIcon className="w-5 h-5" />}
                            {fileDetails.type === 'other' && <FileText className="w-5 h-5" />}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-[#2D1E18] truncate">
                              {fileDetails.name}
                            </div>
                            <div className="text-[10px] text-[#4A3B34]">
                              {fileDetails.type.toUpperCase()} • {fileDetails.size}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearFile}
                          className="p-1.5 text-[#C05A3E] hover:bg-[#C05A3E]/10 rounded flex-shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Live Audio Test Player */}
                      {fileDetails.type === 'audio' && fileDetails.previewUrl && (
                        <div className="pt-2 border-t border-[#2D1E18]/10">
                          <div className="text-[10px] font-bold text-[#C05A3E] mb-1 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            <span>Audio File Preview (Press Play to Test):</span>
                          </div>
                          <audio controls src={fileDetails.previewUrl} className="w-full h-9 rounded bg-white border border-[#2D1E18]/15" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Dedicated Audio File Upload */}
                      {importSource === 'audio' && (
                        <div
                          onClick={() => audioInputRef.current?.click()}
                          className="border-2 border-dashed border-[#C05A3E]/40 hover:border-[#C05A3E] rounded-lg p-5 text-center cursor-pointer transition-colors bg-[#FAF4EB]/80"
                        >
                          <input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <Music className="w-8 h-8 text-[#C05A3E] mx-auto mb-2" />
                          <div className="text-xs font-bold text-[#2D1E18]">
                            Click to Upload Audio File (Song, Folk Tale, Instrument)
                          </div>
                          <div className="text-[10px] text-[#4A3B34] mt-0.5">
                            Supports MP3, WAV, OGG, M4A, AAC, WEBM audio formats
                          </div>
                        </div>
                      )}

                      {/* Live Microphone Voice Recorder */}
                      {importSource === 'mic' && (
                        <div className="border-2 border-dashed border-[#C05A3E]/40 rounded-lg p-5 text-center bg-[#FAF4EB]/80 space-y-3">
                          <Mic className={`w-8 h-8 mx-auto ${isRecording ? 'text-red-600 animate-pulse' : 'text-[#C05A3E]'}`} />
                          <div>
                            <div className="text-xs font-bold text-[#2D1E18]">
                              {isRecording ? 'Recording Voice Live...' : 'Record Folk Song or Narrative Live'}
                            </div>
                            <div className="text-[10px] text-[#4A3B34] mt-0.5">
                              {isRecording ? `Recording Time: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}` : 'Click start recording to capture live oral history using your microphone'}
                            </div>
                          </div>

                          <div className="flex justify-center gap-3">
                            {!isRecording ? (
                              <button
                                type="button"
                                onClick={startVoiceRecording}
                                className="px-4 py-2 rounded-lg bg-[#C05A3E] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#A0452B] shadow-sm"
                              >
                                <Mic className="w-4 h-4" />
                                <span>Start Recording</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={stopVoiceRecording}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-red-700 animate-pulse shadow-sm"
                              >
                                <Square className="w-4 h-4 fill-white" />
                                <span>Stop & Save Recording</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Desktop Source */}
                      {importSource === 'desktop' && (
                        <div
                          onClick={() => desktopInputRef.current?.click()}
                          className="border-2 border-dashed border-[#2D1E18]/20 hover:border-[#C05A3E] rounded-lg p-5 text-center cursor-pointer transition-colors bg-[#FAF4EB]/50"
                        >
                          <input
                            ref={desktopInputRef}
                            type="file"
                            accept="audio/*,video/*,image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <HardDrive className="w-8 h-8 text-[#C05A3E] mx-auto mb-2" />
                          <div className="text-xs font-bold text-[#2D1E18]">
                            Click to select Audio, Video, or Image from Desktop
                          </div>
                          <div className="text-[10px] text-[#4A3B34] mt-0.5">
                            Supports MP3, WAV, MP4, WEBM, PNG, JPG files
                          </div>
                        </div>
                      )}

                      {/* Gallery Source */}
                      {importSource === 'gallery' && (
                        <div
                          onClick={() => galleryInputRef.current?.click()}
                          className="border-2 border-dashed border-[#2D1E18]/20 hover:border-[#C05A3E] rounded-lg p-5 text-center cursor-pointer transition-colors bg-[#FAF4EB]/50"
                        >
                          <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*,video/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <Smartphone className="w-8 h-8 text-[#C05A3E] mx-auto mb-2" />
                          <div className="text-xs font-bold text-[#2D1E18]">
                            Open Device Photo / Video Gallery
                          </div>
                          <div className="text-[10px] text-[#4A3B34] mt-0.5">
                            Choose recorded folk performance, photo, or audio clip
                          </div>
                        </div>
                      )}

                      {/* Google Drive Source */}
                      {importSource === 'drive' && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-[#2D1E18] block">
                            Paste Google Drive Shareable Link:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={driveUrlInput}
                              onChange={(e) => setDriveUrlInput(e.target.value)}
                              placeholder="https://drive.google.com/file/d/..."
                              className="flex-1 bg-white border border-[#2D1E18]/20 rounded px-3 py-2 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleProcessDriveLink}
                              className="px-4 py-2 rounded bg-[#2D1E18] text-[#D4AF37] text-xs font-bold uppercase hover:bg-[#1F1410]"
                            >
                              Import
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Web Link Source */}
                      {importSource === 'url' && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-[#2D1E18] block">
                            Paste Direct Web URL (Unsplash, Soundcloud, MP3/MP4 link):
                          </label>
                          <input
                            type="url"
                            value={formData.mediaUrl}
                            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... or https://domain.com/audio.mp3"
                            className="w-full bg-white border border-[#2D1E18]/20 rounded px-3 py-2 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#2D1E18]/15 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCloseModal}
                    className="px-4 py-2.5 rounded bg-[#2D1E18]/10 text-[#2D1E18] text-xs font-bold uppercase tracking-wider hover:bg-[#2D1E18]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-[#C05A3E] text-[#FAF4EB] font-bold text-xs uppercase tracking-wider hover:bg-[#9A3B1B] flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Publish Contribution
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Harmful Contribution Modal */}
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setReportTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Report Harmful Contribution
            </div>

            <p className="text-xs text-[#4A3B34] leading-relaxed">
              Help maintain community safety. You are reporting: <strong className="text-[#2D1E18] font-bold">"{reportTarget.title}"</strong>
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold">Report Submitted</div>
                <p className="text-[11px] text-emerald-800">
                  Thank you for keeping Gulzameen safe. {reportAlsoHide ? 'This contribution has been removed from view.' : 'Our team will review this report.'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reportTarget) return;
                  if (onReportContribution) {
                    onReportContribution(reportTarget.id, reportTarget.title, reportReason, reportDetails);
                  }
                  if (reportAlsoHide && onRemoveContribution) {
                    onRemoveContribution(reportTarget.id);
                  }
                  setReportSubmitted(true);
                  setTimeout(() => {
                    setReportTarget(null);
                    setReportSubmitted(false);
                  }, 2000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                    Select Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white border border-[#2D1E18]/20 rounded-lg p-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none font-medium"
                  >
                    <option value="Hate Speech or Harassment">Hate Speech, Offensive, or Harassment</option>
                    <option value="Inappropriate Media">Inappropriate / Harmful Image or Audio</option>
                    <option value="Misinformation or Cultural Disrespect">Misinformation or Cultural Misattribution</option>
                    <option value="Copyright / Unauthorized Content">Copyright Violation or Unauthorized Post</option>
                    <option value="Spam or Unrelated Content">Spam or Unrelated Content</option>
                    <option value="Other Safety Issue">Other Safety Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                    Additional Details <span className="text-[10px] text-[#4A3B34] font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any context..."
                    className="w-full bg-white border border-[#2D1E18]/20 rounded-lg p-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="reportHideContrib"
                    checked={reportAlsoHide}
                    onChange={(e) => setReportAlsoHide(e.target.checked)}
                    className="w-4 h-4 accent-[#C05A3E] rounded cursor-pointer"
                  />
                  <label htmlFor="reportHideContrib" className="text-xs text-[#2D1E18] font-medium cursor-pointer">
                    Also remove/hide this submission immediately
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D1E18]/15">
                  <button
                    type="button"
                    onClick={() => setReportTarget(null)}
                    className="px-4 py-2 rounded-lg bg-white border border-[#2D1E18]/20 text-[#2D1E18] font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-sm w-full p-6 relative shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
              <Trash2 className="w-6 h-6" />
            </div>

            <h4 className="font-serif text-lg font-bold text-[#2D1E18]">
              Remove Contribution?
            </h4>

            <p className="text-xs text-[#4A3B34] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#2D1E18]">"{deleteTarget.title}"</strong>? This will remove it from the community archive.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-white border border-[#2D1E18]/20 text-[#2D1E18] font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteTarget && onRemoveContribution) {
                    onRemoveContribution(deleteTarget.id);
                  }
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
