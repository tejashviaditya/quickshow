import { ArrowRight, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  return (
    <section className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 overflow-hidden">
      <BlurCircle top="0px" right="-80px" />

      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-primary to-accent-purple" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2">
            Now Showing
            <Flame className="w-5 h-5 text-primary animate-bounce" />
          </h2>
        </div>

        <button
          onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-primary transition-colors cursor-pointer"
        >
          View All Movies
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 justify-items-center sm:justify-items-stretch">
        {shows.slice(0, 4).map((show) => (
          <MovieCard key={show._id || show.id} movie={show} />
        ))}
      </div>

      {/* Explore More Button */}
      {shows.length > 4 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
            className="glow-btn px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dull text-white font-medium text-sm rounded-full shadow-lg shadow-primary/25 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Explore More Movies
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
