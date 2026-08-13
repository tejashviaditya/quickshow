import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Ticket, Calendar, Clock, CheckCircle2, CreditCard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyBooking = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelect = (bookingId) => {
    setSelectedIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookings.map((b) => b._id));
    }
  };

  const handleBulkDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove the selected bookings?"
    );
    if (!isConfirmed) return;

    try {
      const { data } = await axios.post(
        '/api/user/bookings/hide-bulk',
        { bookingIds: selectedIds },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setBookings((prev) => prev.filter((b) => !selectedIds.includes(b._id)));
        setSelectedIds([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while removing the selected bookings");
    }
  };

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get(`/api/user/bookings`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBooking = async (bookingId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this booking from your recent bookings?"
    );
    if (!isConfirmed) return;

    try {
      const { data } = await axios.post(
        `/api/user/bookings/hide/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while removing the booking");
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-6xl mx-auto min-h-[85vh]">
      <BlurCircle top="100px" left="-50px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5" />
            Your Purchases
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            My Movie Bookings
          </h1>
        </div>

        <div className="text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-max">
          Total Bookings: <span className="text-primary font-bold">{bookings.length}</span>
        </div>
      </div>

      {/* Bookings Ticket Stubs List */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl text-center px-6 border border-white/10 mt-6">
          <Ticket className="w-16 h-16 text-gray-600 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">No Bookings Found</h2>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            You haven't booked any movie tickets yet. Explore our latest blockbusters and reserve your seats!
          </p>
          <button
            onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
            className="glow-btn px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold text-sm rounded-full shadow-lg shadow-primary/30 active:scale-95 cursor-pointer"
          >
            Explore Movies Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((item, index) => {
            const seats = Array.isArray(item.bookedSeats) ? item.bookedSeats : [];
            const movie = item.show?.movie;

            return (
              <div
                key={item._id || index}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveBooking(item._id)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all duration-200 z-10 cursor-pointer"
                  title="Remove booking"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {/* Left Poster & Movie Info */}
                <div className="flex flex-col sm:flex-row gap-5 flex-1">
                  <div className="w-full sm:w-36 h-44 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 relative">
                    <img
                      src={image_base_url + (movie?.poster_path || movie?.backdrop_path || '')}
                      alt={movie?.title || 'Movie Poster'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-primary border border-white/15">
                      {movie?.original_language ? movie.original_language.toUpperCase() : 'EN'}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        {movie?.title || 'Movie Title'}
                      </h3>
                      {movie?.runtime > 0 && (
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {timeFormat(movie.runtime)}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'Date Pending'}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-medium">Seats:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {seats.map((seat) => (
                            <span
                              key={seat}
                              className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/40 text-primary text-xs font-bold"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Perforated Ticket Divider (Desktop) */}
                <div className="hidden md:block w-[1px] bg-dashed border-r border-dashed border-white/15 my-2" />

                {/* Right Price & Status Panel */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 min-w-[160px]">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Amount Paid</p>
                    <p className="text-2xl font-extrabold text-white mt-0.5">
                      {currency}{item.amount}
                    </p>
                  </div>

                  <div>
                    {item.isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed
                      </span>
                    ) : (
                      <button className="glow-btn flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-primary-dull text-white text-xs font-bold rounded-full shadow-md shadow-primary/30 active:scale-95 cursor-pointer">
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
