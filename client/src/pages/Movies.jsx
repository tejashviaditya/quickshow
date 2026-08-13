import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';
import { Film, Clapperboard, Sparkles } from 'lucide-react';

const Movies = () => {
  const { shows } = useAppContext();
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Fantasy', 'Horror', 'Comedy'];

  const filteredMovies = selectedGenre === 'All'
    ? shows
    : shows.filter(movie =>
        Array.isArray(movie.genres) &&
        movie.genres.some(g => g.name?.toLowerCase().includes(selectedGenre.toLowerCase()))
      );

  return (
    <div className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto min-h-[85vh]">
      <BlurCircle top="120px" left="-50px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Cinema Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Now Showing in Theaters
            <Film className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Explore active showtimes, select seats, and book your tickets instantly.
          </p>
        </div>

        <div className="text-sm font-medium text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-max">
          Showing <span className="text-primary font-bold">{filteredMovies.length}</span> Movies
        </div>
      </div>

      {/* Genre Filter Tabs */}
      {shows.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-primary to-primary-dull text-white font-semibold shadow-md shadow-primary/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Movie Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 justify-items-center sm:justify-items-stretch">
          {filteredMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id || movie.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 glass-card rounded-3xl mt-8 text-center px-6 border border-white/10">
          <Clapperboard className="w-16 h-16 text-gray-600 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">No Movies Found</h2>
          <p className="text-gray-400 max-w-md text-sm">
            {selectedGenre !== 'All'
              ? `No movies currently available under the "${selectedGenre}" category.`
              : 'There are no active movies showing at the moment. Please check back later.'}
          </p>
          {selectedGenre !== 'All' && (
            <button
              onClick={() => setSelectedGenre('All')}
              className="mt-6 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-full shadow-lg shadow-primary/30 hover:bg-primary-dull transition"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
