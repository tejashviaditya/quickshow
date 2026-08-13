import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { Heart, Star, Play, Ticket, Sparkles, User as UserIcon, X } from 'lucide-react';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { dummyTrailers } from '../assets/assets';

// Extract YouTube video ID from a full YouTube URL
const getYouTubeId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext();

  const posterRef = useRef(null);
  const [posterTilt, setPosterTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const [isPosterHovered, setIsPosterHovered] = useState(false);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) {
        return toast.error('Please login to favorite the movie');
      }
      const { data } = await axios.post(
        '/api/user/update-favorite',
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!show || !show.movie) return <Loading />;

  const isFav = favoriteMovies.some((m) => m._id === show.movie._id || m.id === show.movie.id);
  const trailerVideoId = getYouTubeId(show.trailerUrl || dummyTrailers[0]?.videoUrl || 'https://www.youtube.com/watch?v=WpW36ldAqnM');
  const trailerEmbedUrl = trailerVideoId
    ? `https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <div className="relative pt-24 pb-20 w-full min-h-screen">
      
      {/* Hero Ambient Backdrop */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={image_base_url + (show.movie.backdrop_path || show.movie.poster_path)}
          alt={show.movie.title}
          className="w-full h-full object-cover object-top opacity-35 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-transparent to-[#090A0F]" />
      </div>

      {/* Main Content Details Panel */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 -mt-64 md:-mt-80">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/15 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <BlurCircle top="-100px" right="-100px" />

          {/* Poster Image */}
          <div
            ref={posterRef}
            onMouseMove={(e) => {
              const el = posterRef.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const cx = rect.width / 2;
              const cy = rect.height / 2;
              const rotateX = ((y - cy) / cy) * -6;
              const rotateY = ((x - cx) / cx) * 6;
              const shineX = (x / rect.width) * 100;
              const shineY = (y / rect.height) * 100;
              setPosterTilt({ x: rotateX, y: rotateY, shine: { x: shineX, y: shineY } });
            }}
            onMouseEnter={() => setIsPosterHovered(true)}
            onMouseLeave={() => {
              setIsPosterHovered(false);
              setPosterTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
            }}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: isPosterHovered
                ? `perspective(1000px) rotateX(${posterTilt.x}deg) rotateY(${posterTilt.y}deg) translateZ(10px)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              transition: isPosterHovered
                ? 'transform 0.08s ease'
                : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            className="w-full md:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative group card-3d"
          >
            {/* Dynamic shine overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              style={{
                background: isPosterHovered
                  ? `radial-gradient(circle at ${posterTilt.shine.x}% ${posterTilt.shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
                  : 'none',
                opacity: isPosterHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
            <img
              src={image_base_url + show.movie.poster_path}
              alt={show.movie.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-primary text-xs font-bold uppercase tracking-wider">
              {show.movie.original_language ? show.movie.original_language.toUpperCase() : 'EN'}
            </div>
          </div>

          {/* Movie Info */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                In Theaters Now
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {show.movie.title}
            </h1>

            {/* Rating & Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                {show.movie.vote_average ? show.movie.vote_average.toFixed(1) : '0.0'} / 10
              </div>
              <span className="text-gray-500">•</span>
              <span>{timeFormat(show.movie.runtime)}</span>
              <span className="text-gray-500">•</span>
              <span>{show.movie.release_date ? show.movie.release_date.split('-')[0] : ''}</span>
            </div>

            {/* Genre Tags */}
            {Array.isArray(show.movie.genres) && show.movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {show.movie.genres.map((genre) => (
                  <span
                    key={genre.id || genre.name}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-2 font-normal">
              {show.movie.overview}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <a
                href="#dateSelect"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("dateSelect");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="glow-btn flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold text-sm rounded-full shadow-lg shadow-primary/30 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                Buy Tickets
              </a>

              <button
                onClick={() => setShowTrailerModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-sm rounded-full backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Trailer
              </button>

              <button
                onClick={handleFavorite}
                className={`p-3.5 rounded-full border transition-all duration-300 active:scale-90 cursor-pointer ${
                  isFav
                    ? 'bg-primary/20 border-primary text-primary shadow-md shadow-primary/30'
                    : 'bg-white/10 border-white/15 text-gray-300 hover:text-primary hover:border-primary/50'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {show.movie.cast && show.movie.cast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              Featured Cast
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {show.movie.cast.slice(0, 12).map((cast, index) => (
                <div
                  key={cast.id || index}
                  className="flex flex-col items-center text-center gap-2 min-w-[100px] group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-all duration-300 shadow-md bg-black/40">
                    {cast.profile_path ? (
                      <img
                        src={image_base_url + cast.profile_path}
                        alt={cast.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <UserIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-primary transition-colors truncate max-w-[100px]">
                    {cast.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Showtimes & Date Selection */}
        <div id="dateSelect" className="mt-16">
          <DateSelect dateTime={show.dateTime} id={id} />
        </div>

        {/* Recommendations */}
        <div className="mt-20">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
            <button
              onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
            {shows.slice(0, 4).map((movie, index) => (
              <MovieCard movie={movie} key={movie._id || index} />
            ))}
          </div>
        </div>

      </div>

      {/* Trailer Modal Overlay */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn">
          <div className="relative w-full max-w-4xl glass-panel p-2 sm:p-4 rounded-3xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/10 text-white hover:bg-primary transition-all duration-300 cursor-pointer"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
              {trailerEmbedUrl && (
                <iframe
                  src={trailerEmbedUrl}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;
