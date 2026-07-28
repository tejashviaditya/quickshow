import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {dummyShowsData,dummyDateTimeData} from '../assets/assets'
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { useEffect } from 'react';
import { Heart, StarIcon,PlayCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';


const MovieDetails = () => {
  const navigate=useNavigate(); //to open a new page when user clicks on book now button
  const {id} = useParams();
    
  const [show, setShow] = useState(null);
  const getShow=async()=>{
    const show =dummyShowsData.find((show)=>show.id===Number(id));
    if(show){
     setShow({
      movie:show,
      dateTime:dummyDateTimeData})

    }
    }
   
    useEffect(()=>{
      getShow();
    },[id])

  return show ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-30 md:pt-50 ">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 mx-auto " >
        <img src={show.movie.poster_path} alt={show.movie.title} className="w-full md:w-1/3 rounded-lg" />
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' right='-100px'/>
          <p className='text-primary'>English</p>
          <h1 className='text-3xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
        
           <div className='flex items-center text-gray-300 gap-2'>
          <StarIcon className='w-5 h-5 text-primary fill-primary'/>
          {show.movie.vote_average.toFixed(1)} User Rating 
           </div>
          <p className='text-gray-400 mt-4 leading-tight font-medium text-sm'>{show.movie.overview}</p>
          <p>{timeFormat(show.movie.runtime)} . {show.movie.genres.map((genre)=>genre.name).join(', ')}
            . {show.movie.release_date.split('-')[0]}
            </p>
          <div className='flex items-center gap-4 mt-6'>
            <button className='flex items-center gap-2  px-7 py-3 text-sm bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300'>
              <PlayCircleIcon className='w-5 h-5 text-primary'/>
            Watch Trailer</button>
            <a href="#dateSelect" className='px-10 py-3 text-small bg-primary  hover:bg-primary-dull transition rounded-md font-medium cursor-pointer 
            active:scale-95 '>Buy Tickets</a>
            <button className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 p-3 rounded-full cursor-pointer ">
              <Heart className={`w-5 h-5 text-primary`}/>

            </button>
          </div>
 
          
          </div>
        </div>

      <p className='text-lg font-medium mt-20 text-gray-300'>
        Your Favourite Cast 
      </p>
      <div className='  overflow-x-auto mt-8  pb-4'>
          <div className='flex gap-4 px-4 items-center w-max'>
            {show.movie.casts.slice(0,12).map((cast,index)=>(
              <div key={index} className='flex flex-col items-center text-center gap-2'>
                <img src={cast.profile_path} alt={cast.name} className='w-20 h-20  rounded-full object-cover aspect-square '/>
                <p className='text-sm font-medium mt-3 text-gray-300'>{cast.name}</p>
              </div>
            ))}

          </div>
      </div>
      <DateSelect dateTime={show.dateTime} id={id}/> 
      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className=' flex  flex-wrap gap-9 justify-between max:sm:justify-center'>
        {dummyShowsData.slice(0,4).map((movie,index)=>(
          <MovieCard movie={movie} key={index} />
        ))}

      </div>
      <div className='flex justify-center  mt-20'>
        <button onClick={()=>navigate("/movies")} className='px-10 py-3 text-small bg-primary  hover:bg-primary-dull transition rounded-md font-medium cursor-pointer 
            active:scale-95 '>Show More</button> 

      </div>
    </div>

     
      
 ) : 
   < Loading />
 
}

export default MovieDetails
