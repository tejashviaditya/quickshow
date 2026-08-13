import { ArrowRight, Calendar, Clock, Star, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='relative w-full min-h-[92vh] flex items-center overflow-hidden pt-20 transition-all duration-700'>

      {/* Background Batman Image - subtle, atmospheric cover */}
      <div
        className="absolute inset-0 bg-[url('https://wallpapercave.com/wp/wp12393116.jpg')] bg-cover bg-center transition-opacity duration-700 pointer-events-none"
      />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

      {/* Strong dark gradients ensuring extreme text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/75 to-black/35 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/85 to-transparent z-10" />

      {/* Ambient cinematic light leak from top-right */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-[120px] z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-purple/4 rounded-full blur-[100px] z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-16 flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left — Text Content */}
        <div className="flex flex-col items-start gap-6 flex-1 max-w-2xl">

          {/* Featured Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md depth-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Featured Release
          </div>

          {/* Title Logo */}
          <div className="max-w-xl">
            <img
              src="https://cdn.marvel.com/content/1x/avengersdoomsday_lob_log_def_02.webp"
              alt="Avengers Doomsday"
              className="w-full max-w-md h-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300">
            <span className="px-3 py-1 rounded-md bg-white/10 border border-white/10 text-white font-semibold depth-sm backdrop-blur-sm">
              4K Ultra HD
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-white/10 border border-white/10 text-amber-400 depth-sm backdrop-blur-sm">
              {/* <Star className="w-4 h-4 fill-amber-400" />
              9.2 / 10 */}
              <p className="text-yellow-300">Coming Soon</p>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Calendar className="w-4 h-4 text-primary" />
              2026
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Clock className="w-4 h-4 text-primary" />
              2h 45m
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Action • Adventure • Sci-Fi</span>
          </div>

          {/* Description */}
          <p className="max-w-xl text-gray-300 text-base sm:text-lg leading-relaxed font-normal text-balance drop-shadow">
            In Avengers: Doomsday, Earth's mightiest heroes face their most dangerous challenge as Doctor Doom emerges with the power to reshape reality itself. As the multiverse falls into chaos, old allies reunite and new heroes rise.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
              className="glow-btn flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold text-sm sm:text-base rounded-full cursor-pointer"
            >
              Explore Movies
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#trailers"
              onClick={() => {
                const el = document.getElementById("trailers");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm sm:text-base rounded-full backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer depth-sm hover:depth-md"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              Watch Trailer
            </a>
          </div>
        </div>

        {/* Right — Floating 3D Movie Posters (desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-8 flex-shrink-0 relative">
          {/* Glow halo behind posters */}
          <div className="absolute w-[500px] h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />

          {/* Poster 1: Ramayana */}
          <div className="hero-poster-3d relative w-52 rounded-3xl overflow-hidden border border-white/15 poster-edge-light">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
            <img
              src="https://image.tmdb.org/t/p/w500/f3yZZw7zIsWo6m9xJStfjDauIZX.jpg"
              alt="Ramayana"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?q=80&w=500";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xs text-center px-3 leading-tight drop-shadow-lg">
                Ramayana
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-600/95 text-white text-[9px] font-bold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Poster 2: The Odyssey */}
          <div
            className="hero-poster-3d relative w-52 rounded-3xl overflow-hidden border border-white/15 poster-edge-light"
            style={{ animationDelay: '2.5s' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
            <img
              src="https://image.tmdb.org/t/p/w500/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg"
              alt="The Odyssey"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xs text-center px-3 leading-tight drop-shadow-lg">
                The Odyssey
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/95 text-white text-[9px] font-bold uppercase tracking-wider">
                Now Showing
              </span>
            </div>
          </div>

          {/* Reflection / shadow under poster */}
          <div className="absolute -bottom-6 w-full h-6 bg-black/50 blur-md rounded-full" />
        </div>
      </div>

    </div>
  );
};

export default HeroSection;