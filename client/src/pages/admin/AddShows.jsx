import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { useState, useEffect } from "react";
import { CheckIcon, Delete, Star } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";



const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();//getting the axios instance and the user data from the context tmdb api


  const currency = import.meta.env.VITE_CURRENCY || '₹';
  //create state for now playing movies
  const [nowPlayingMovie, setNowPlayingMovie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); //now for selecting movies tick
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateInput, setDateInput] = useState("");       // date picker
  const [hourInput, setHourInput] = useState("12");    // 1-12
  const [minuteInput, setMinuteInput] = useState("00"); // 00-55
  const [ampmInput, setAmpmInput] = useState("AM");    // AM | PM
  const [showPrice, setShowPrice] = useState("");

  // Convert 12h → 24h "HH:MM" string for backend
  const get24hTime = () => {
    let h = parseInt(hourInput, 10);
    if (ampmInput === "AM") {
      if (h === 12) h = 0;         // 12 AM → 00
    } else {
      if (h !== 12) h += 12;       // 1-11 PM → 13-23
    }
    return `${String(h).padStart(2, "0")}:${minuteInput}`;
  };

  const [addingShow, setAddingShow] = useState(false)

  //fetch now playing movies 
  const fetchNowPlayingMovie = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', { headers: { 'Authorization': `Bearer ${await getToken()}` } })
      if (data.success) {
        setNowPlayingMovie(data.movies);
      }

    } catch (error) {
      console.log("Error fetching now playing movies:", error);
    }



  }

  //this is for adding date and time using separate inputs
  const handleDateTimeAdd = () => {
    if (!dateInput) {
      toast.error('Please select a date.');
      return;
    }
    const time24 = get24hTime();

    setDateTimeSelection((prev) => {
      const times = prev[dateInput] || [];
      if (!times.includes(time24)) {
        return { ...prev, [dateInput]: [...times, time24] };
      }
      toast.error('This time slot is already added.');
      return prev;
    });
  };
  //this is for removing date and time
  const handleRemoveDateTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = (prev[date] || []).filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const rest = { ...prev };
        delete rest[date];
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };



  const handleSubmit = async () => {
    // validate first — before disabling the button
    let currentSelection = { ...dateTimeSelection };

    // auto-add current dropdowns if user forgot to click "+ Add Time"
    if (Object.keys(currentSelection).length === 0 && dateInput) {
      currentSelection[dateInput] = [get24hTime()];
    }

    if (!selectedMovie) {
      toast.error('Please select a movie.');
      return;
    }
    if (Object.keys(currentSelection).length === 0) {
      toast.error('Please select a date and add at least one time slot.');
      return;
    }
    if (!showPrice) {
      toast.error('Please enter a show price.');
      return;
    }

    // all valid — disable button and submit
    setAddingShow(true);
    try {
      const showsInput = Object.entries(currentSelection).flatMap(([date, times]) =>
        times.map((time) => ({ date, time }))
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await axios.post('/api/show/add', payload, {
        headers: { 'Authorization': `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice('');
        setDateInput('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred, please try again.');
    } finally {
      setAddingShow(false); // always re-enables the button
    }
  }

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovie();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  //we are now returing the all movies 
  return nowPlayingMovie.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="text-xl font-medium mt-10">Now Playing Movie</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-6 rounded mt-4 w-max ">
          {nowPlayingMovie.map((movie) => (
            <div
              key={movie.id}
              className={` pt-5 relative max-w-50 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-2 transition duration-300  `}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className=" relative overflow-hidden rounded-md">
                <img
                  src={image_base_url + movie.poster_path}
                  alt="movie"
                  className="w-full brightness-100 object-cover"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0 right-0">
                  <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {selectedMovie === movie.id && ( //when selected movie is equal to movie id
                <div className="absolute top-2 right-2 flex items-center justify-center h-6 w-6  rounded bg-primary ">
                  <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                </div>
              )}

              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-sm text-gray-400 mt-1">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>


      {/* show price input */}
      <div className="mt-8">
        <label className="block text-xl font-medium mb-2">
          Show Price
        </label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-xl text-gray-400">{currency}</p>
          <input min={0} type="number" value={showPrice} onChange={(e) => {
            setShowPrice(e.target.value)
          }
          } className="outline-none" placeholder="Enter Show Price" />

        </div>

        {/* date and time selection — two separate inputs */}
        <div className="mt-4">
          <label className="block text-xl font-medium mb-2">Select Date &amp; Time</label>
          <div className="flex flex-wrap items-end gap-3">

            {/* Date picker */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</span>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="outline-none rounded-lg bg-white/5 border border-gray-600 text-gray-200 px-3 py-2 cursor-pointer [color-scheme:dark] focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Hour dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Hour</span>
              <select
                value={hourInput}
                onChange={(e) => setHourInput(e.target.value)}
                className="outline-none rounded-lg bg-[#1a1d2e] border border-gray-600 text-gray-200 px-3 py-2 cursor-pointer focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Minute dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Minute</span>
              <select
                value={minuteInput}
                onChange={(e) => setMinuteInput(e.target.value)}
                className="outline-none rounded-lg bg-[#1a1d2e] border border-gray-600 text-gray-200 px-3 py-2 cursor-pointer focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              >
                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* AM / PM dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">AM / PM</span>
              <select
                value={ampmInput}
                onChange={(e) => setAmpmInput(e.target.value)}
                className="outline-none rounded-lg bg-[#1a1d2e] border border-gray-600 text-gray-200 px-3 py-2 cursor-pointer focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            {/* Add Time button */}
            <button
              onClick={handleDateTimeAdd}
              className="bg-primary/80 text-white hover:bg-primary cursor-pointer px-5 text-sm rounded-lg py-2 font-medium transition-colors self-end"
            >
              + Add Time
            </button>
          </div>
        </div>
      </div>

      {/* displaying the selected times */}
      {Object.keys(dateTimeSelection).length > 0 && ( //if there is any date and time selected
        <div className="mt-4">
          <h2 className="text-xl font-bold">Selected Date-Times</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex mt-1 flex-wrap gap-2">
                  {times.map((time) => (
                    <div key={time} className="border border-primary px-2 py-1 flex items-center gap-1 rounded-md">
                      <span>{time}</span>
                      <Delete onClick={() => handleRemoveDateTime(date, time)} width={15} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />

                    </div>

                  ))}


                </div>
              </li>
            ))}

          </ul>
        </div>
      )}
      <button onClick={handleSubmit} disabled={addingShow} className="bg-primary/80 text-white hover:bg-primary/90 mt-6 cursor-pointer px-8 text-sm rounded py-2 ">
        Add Show
      </button>

    </>


  ) : (
    <Loading />
  );
};




export default AddShows;
