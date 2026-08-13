import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import BlurCircle from '../components/BlurCircle';
import Loading from '../components/Loading';
import { ArrowRight, Clock, Monitor, CheckCircle, Info } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import toast from "react-hot-toast";
import { useAppContext } from '../context/AppContext';

const SeatLayout = () => {
  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [showPrice, setShowPrice] = useState(0);

  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

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

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a showtime first", { icon: '⏰' });
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("Seat is already reserved by another user", { icon: '🚫' });
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can select up to 5 seats per transaction", { icon: '⚠️' });
    }
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex items-center gap-3 mt-2">
      <span className="w-5 text-xs font-bold text-gray-400 text-center">{row}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              disabled={isOccupied}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 text-xs font-bold rounded-lg border cursor-pointer ${
                isOccupied
                  ? 'seat-occupied bg-gray-800/40 border-gray-700/40 text-gray-700 cursor-not-allowed'
                  : isSelected
                  ? 'seat-selected bg-gradient-to-br from-primary to-primary-dull text-white border-primary ring-2 ring-primary/40'
                  : 'seat-available bg-white/5 hover:bg-primary/15 text-gray-300 border-white/15 hover:border-primary/50'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats || []);
        // Fetch the show's price from the DB via the showId
        const showRes = await axios.get(`/api/booking/show-price/${selectedTime.showId}`);
        if (showRes.data?.success) {
          setShowPrice(showRes.data.showPrice || 0);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const bookTickets = async () => {
    try {
      if (!user) {
        return toast.error('Please login to book tickets');
      }
      if (!selectedTime || !selectedSeats.length) {
        return toast.error('Please select showtime and at least one seat');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        return toast.error("Razorpay SDK failed to load. Check your internet connection.");
      }

      const { data } = await axios.post(
        '/api/booking/create',
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        const options = {
          key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_k9G7r5H2WfLpQ3",
          amount: data.order.amount,
          currency: data.order.currency,
          name: "QuickShow Cinema",
          description: `Movie: ${show?.movie?.title || "Ticket Booking"} | Seats: ${selectedSeats.join(', ')}`,
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.booking._id
              };
              const verifyRes = await axios.post(
                '/api/booking/verify-payment',
                verifyPayload,
                { headers: { Authorization: `Bearer ${await getToken()}` } }
              );
              if (verifyRes.data.success) {
                toast.success("Payment successful! Tickets booked.");
                navigate('/my-bookings');
              } else {
                toast.error(verifyRes.data.message);
              }
            } catch (err) {
              console.log(err);
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: {
            color: "#F84565"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime]);

  if (!show) return <Loading />;

  const totalPrice = selectedSeats.length * showPrice;

  return (
    <div className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
      <BlurCircle top="100px" left="-50px" />

      {/* Available Times Sidebar */}
      <div className="w-full lg:w-72 glass-panel p-6 rounded-3xl border border-white/15 shadow-xl lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Select Showtime</h3>
        </div>

        <div className="flex flex-col gap-3">
          {show.dateTime?.[date]?.map((item) => {
            const isSelected = selectedTime?.time === item.time;
            return (
              <button
                key={item.time}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 border text-sm font-semibold ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-dull text-white border-primary ring-2 ring-primary/30 shadow-md shadow-primary/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
                  <span>{isoTimeFormat(item.time)}</span>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {!selectedTime && (
          <p className="text-xs text-amber-400/90 flex items-center gap-1.5 mt-2 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20">
            <Info className="w-4 h-4 flex-shrink-0" />
            Pick a time slot to view seat availability.
          </p>
        )}
      </div>

      {/* Seat Layout Grid Container */}
      <div className="flex-1 glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <BlurCircle bottom="-100px" right="-100px" />

        <h2 className="text-2xl font-bold text-white mb-6">Choose Seats</h2>

        {/* Curved Cinema Screen Graphic */}
        <div className="w-full max-w-lg flex flex-col items-center mb-10">
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_rgba(248,69,101,0.8)]" />
          <div className="w-full h-8 bg-gradient-to-b from-primary/20 to-transparent clip-path-screen flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase flex items-center gap-1.5 mt-2">
              <Monitor className="w-3.5 h-3.5 text-primary" />
              CINEMA SCREEN DIRECTION
            </span>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-white/5 border border-white/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-r from-primary to-primary-dull border border-primary shadow-sm" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-800 border border-gray-700 opacity-60" />
            <span>Occupied</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="flex flex-col items-center gap-2 overflow-x-auto max-w-full pb-4 no-scrollbar">
          <div className="flex flex-col gap-2 mb-4">
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Checkout Action Footer */}
        <div className="w-full mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Selected Seats ({selectedSeats.length})
            </p>
            <p className="text-sm font-bold text-white mt-1">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Price</p>
              <p className="text-2xl font-extrabold text-primary">₹{totalPrice}</p>
            </div>

            <button
              onClick={bookTickets}
              disabled={!selectedSeats.length || !selectedTime}
              className={`glow-btn flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                selectedSeats.length && selectedTime
                  ? 'bg-gradient-to-r from-primary to-primary-dull text-white shadow-lg shadow-primary/30 active:scale-95'
                  : 'bg-white/10 text-gray-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              Proceed To Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeatLayout;
