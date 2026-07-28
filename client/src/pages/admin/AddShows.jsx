import React from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { dummyShowsData } from "../../assets/assets";
import { useState, useEffect } from "react";
import { CheckIcon, Delete, Star } from "lucide-react";
import { kConverter } from "../../lib/Kconverter";






const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  //create state for now playing movies
  const [nowPlayingMovie, setNowPlayingMovie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); //now for selecting movies tick
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  //fetch now playing movies
  const fetchNowPlayingMovie = async () =>{
    setNowPlayingMovie(dummyShowsData);
  }

  //this is for adding date and time
  //we are using date time input to fetch the movies
  const handleDateTimeAdd = async () => {
    
    if(!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if(!date || !time) return; //if date or time is not present then return

     setDateTimeSelection((prev)=>{
      const times= prev[date]||[]; // if not selected date then return empty array
      if(!times.includes(time)){ 
        return {
          ...prev,
          [date]: [...times, time]
        } 
      }
      return prev;
    })
     }
     //this is for removing date and time
     const handleRemoveDateTime = (date,time) => {
       setDateTimeSelection((prev)=>{
         const filteredTimes = prev[date].filter((t)=>t!==time);
         if(filteredTimes.length===0){
          const {[date]:times, ...rest} = prev;
          return rest;
          
         }
         return {...prev,[date]:filteredTimes}
       })     
     }

           

  

    
  useEffect(() => {
    fetchNowPlayingMovie();
  }, []);


  //we are now returing the all movies 
  return nowPlayingMovie.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="text-xl font-medium mt-10">Now Playing Movie</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-6 rounded mt-4 w-max ">
          {nowPlayingMovie.map((movie) => (
            <div
              key={movie._id}
              className={` pt-5 relative max-w-50 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-2 transition duration-300  `}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className=" relative overflow-hidden rounded-md">
                <img
                  src={movie.poster_path}
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
          <input min={0} type="number" value={showPrice} onChange={(e)=>{
          setShowPrice(e.target.value)}
          }  className="outline-none" placeholder="Enter Show Price" />

        </div>

        {/* date and time selection */}
        <div className="mt-4">
          <label className="block text-xl font-medium mb-2">Select Date and Time</label>
          <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg"> 
            <input type="datetime-local" value={dateTimeInput} onChange={(e)=>
              setDateTimeInput(e.target.value)} 
              className="outline-none rounded-md" />
            
            <button onClick={handleDateTimeAdd} className="bg-primary/80 text-white hover:bg-primary cursor-pointer px-3 text-sm rounded-lg py-2 ">
              Add Time
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
                     <Delete onClick={()=>handleRemoveDateTime(date,time)} width={15} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />
                      
                    </div>

                  ))}
                  
                  
                </div>
              </li>
            ))}
              
          </ul>
      </div>
    )}
    <button onClick={handleDateTimeAdd} className="bg-primary/80 text-white hover:bg-primary/90 mt-6 cursor-pointer px-8 text-sm rounded py-2 ">
      Add Show
    </button>
    </>
  ) : (
    <Loading />
  );
}
;

export default AddShows;
