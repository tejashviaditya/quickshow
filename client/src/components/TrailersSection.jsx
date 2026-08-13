import { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import BlurCircle from './BlurCircle';
import { Play, Film } from 'lucide-react';

// Extract YouTube video ID from a YouTube URL
const getYouTubeId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [key, setKey] = useState(0); // force iframe remount on trailer change

  const handleSelectTrailer = (trailer) => {
    setCurrentTrailer(trailer);
    setKey(prev => prev + 1); // remount iframe so it autoplays new video
  };

  const videoId = getYouTubeId(currentTrailer.videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <section id="trailers" className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 overflow-hidden">
      <BlurCircle top="-100px" right="-100px" />

      {/* Header */}
      <div className="flex items-center gap-3 pb-8 border-b border-white/10">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary to-accent-purple" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
          Official Trailers &amp; Clips
          <Film className="w-5 h-5 text-primary" />
        </h2>
      </div>

      {/* Video Player Container */}
      <div className="relative mt-8 glass-panel p-2.5 sm:p-4 rounded-3xl overflow-hidden shadow-2xl border border-white/15">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          {embedUrl && (
            <iframe
              key={key}
              src={embedUrl}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>

      {/* Thumbnail Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 max-w-4xl mx-auto">
        {dummyTrailers.map((trailer) => {
          const isSelected = currentTrailer.videoUrl === trailer.videoUrl;
          return (
            <div
              key={trailer.image}
              onClick={() => handleSelectTrailer(trailer)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform border-2 depth-sm ${
                isSelected
                  ? 'border-primary ring-4 ring-primary/20 scale-105 -translate-y-1 shadow-lg shadow-primary/35'
                  : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30 hover:-translate-y-1 hover:shadow-md'
              }`.trim()}
            >
              <img
                src={trailer.image}
                alt="Trailer Thumbnail"
                className="w-full h-24 sm:h-28 object-cover brightness-90 transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay Play Icon */}
              <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary/20' : 'bg-black/40 group-hover:bg-black/20'}`}>
                <div className={`p-2.5 rounded-full transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'bg-primary text-white shadow-lg' : 'bg-black/60 text-white backdrop-blur-md'}`}>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrailersSection;
