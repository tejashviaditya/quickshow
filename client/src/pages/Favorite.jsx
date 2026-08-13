import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useAppContext } from '../context/AppContext';
import { Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const { favoriteMovies } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto min-h-[85vh]">
      <BlurCircle top="120px" left="-50px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Your Watchlist
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Favorite Movies
            <Heart className="w-7 h-7 text-primary fill-primary animate-pulse" />
          </h1>
        </div>

        <div className="text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-max">
          Saved: <span className="text-primary font-bold">{favoriteMovies.length}</span> Movies
        </div>
      </div>

      {/* Favorites Grid */}
      {favoriteMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 justify-items-center sm:justify-items-stretch">
          {favoriteMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id || movie.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl text-center px-6 border border-white/10 mt-6">
          <Heart className="w-16 h-16 text-gray-600 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">No Favorite Movies Saved</h2>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Click the heart icon on any movie page to save it to your personal favorites collection!
          </p>
          <button
            onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
            className="glow-btn px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold text-sm rounded-full shadow-lg shadow-primary/30 active:scale-95 cursor-pointer"
          >
            Browse Cinema Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorite;
