import BlurCircle from './BlurCircle';
import { Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DateSelect = ({ dateTime = {}, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast('Please select a show date to continue', { icon: '⚠️' });
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  const formatDateDisplay = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return {
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
      };
    }
    const d = new Date(dateStr);
    return {
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    };
  };

  const datesList = Object.keys(dateTime);

  return (
    <div id="dateSelect" className="relative py-12">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        <BlurCircle top="-80px" left="-80px" />
        <BlurCircle bottom="-80px" right="-80px" />

        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-white tracking-wide">
              Select Showtime Date
            </h3>
          </div>

          {datesList.length > 0 ? (
            <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
              {datesList.map((date) => {
                const { dayName, dayNum, monthName } = formatDateDisplay(date);
                const isSelected = selected === date;

                return (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center p-3 min-w-[76px] h-22 rounded-2xl cursor-pointer transition-all duration-300 transform border depth-sm ${
                      isSelected
                        ? 'bg-gradient-to-b from-primary to-primary-dull text-white border-primary ring-4 ring-primary/25 scale-105 -translate-y-1 shadow-lg shadow-primary/45'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-md hover:shadow-black/50'
                    }`}
                  >
                    <span className={`text-[10px] font-bold tracking-wider ${isSelected ? 'text-white/90' : 'text-primary'}`}>
                      {dayName}
                    </span>
                    <span className="text-xl font-extrabold text-white my-0.5">
                      {dayNum}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">
                      {monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">
              No showtimes available for this movie yet.
            </p>
          )}
        </div>

        {datesList.length > 0 && (
          <button
            onClick={onBookHandler}
            className="glow-btn w-full lg:w-auto flex items-center justify-center gap-2 px-9 py-4 bg-gradient-to-r from-primary to-primary-dull text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-primary/30 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Select Seats
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateSelect;
