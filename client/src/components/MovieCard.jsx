import { Star, Clock, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();
  const wrapperRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const [isHovered, setIsHovered] = useState(false);

  if (!movie) return null;
  const movieId = movie._id || movie.id;

  const handleClick = () => {
    navigate(`/movies/${movieId}`);
    scrollTo(0, 0);
  };

  const handleMouseMove = (e) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    // Max 8deg tilt
    const rotateX = ((y - cy) / cy) * -7;
    const rotateY = ((x - cx) / cx) * 7;
    // Shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setTilt({ x: rotateX, y: rotateY, shine: { x: shineX, y: shineY } });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  };

  const cardStyle = {
    transform: isHovered
      ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
      : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    transition: isHovered
      ? 'transform 0.08s ease'
      : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  const shineStyle = {
    background: isHovered
      ? `radial-gradient(circle at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
      : 'none',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[280px]"
      style={{ perspective: '900px' }}
    >
      <div
        onClick={handleClick}
        style={cardStyle}
        className="card-3d group relative flex flex-col justify-between glass-card rounded-2xl overflow-hidden cursor-pointer w-full p-3.5 border border-white/10"
      >
        {/* Dynamic shine overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={shineStyle}
        />
        {/* Top-left corner highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />

        {/* Poster Image Container */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden bg-black/40">
          <img
            src={image_base_url + (movie.backdrop_path || movie.poster_path || '')}
            alt={movie.title || 'Movie Poster'}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay on image for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-amber-400 text-xs font-semibold depth-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}
          </div>

          {/* Runtime Badge */}
          {movie.runtime > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-[11px] font-medium">
              <Clock className="w-3 h-3 text-primary" />
              {timeFormat(movie.runtime)}
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="flex flex-col flex-1 mt-3 px-1">
          <h3 className="font-semibold text-base text-white truncate group-hover:text-primary transition-colors duration-300">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate">{movie.genres.slice(0, 2).map(g => g.name).join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10">
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="glow-btn w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-primary to-primary-dull text-white font-medium text-xs rounded-xl transition-all duration-200"
          >
            <Ticket className="w-3.5 h-3.5" />
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

