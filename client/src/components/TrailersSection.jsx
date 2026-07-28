import React,{useState} from 'react'
import {dummyTrailers} from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {
    const[currentTrailer,setCurrentTrailer]=useState(dummyTrailers[0]);
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44  py-20 overflow-hidden'>
        <p className='text-gray-300 font-medium text-lg  mx-auto max-w-240px '>
            Trailers</p>

            
        <div className='relative mt-6'>
            <BlurCircle top='-100px' right='-100px'/>
            <ReactPlayer  src={currentTrailer.videoUrl}
  controls
  width="960px"
  height="540px"
  onReady={() => console.log("Ready")}
  onError={(e) => console.log("Error:", e)}

            

            className="mx-auto max-w-full" width="960px" height="540px" />
        </div>


        <div className='group grid grid-cols-4 md:gap-8  mt-8 max-w-3xl mx-auto'>
             {dummyTrailers.map((trailer )=>(
                <div key={trailer.image } className={'relative cursor-pointer group-hover:not-hover:opacity-50 hover:-translate-y-1 max:md-h-60 md:max-h-60 transition duration-300 '}
                 onClick={()=>setCurrentTrailer(trailer)}>
                    <img src={trailer.image} alt="trailer" className='w-full h-auto rounded-lg object-cover brightness-75'/>
                    <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-5 md:w-8 h-5 md:h-12'/>
                    
                </div>
             ))} 

        </div>
      
    </div>
  )
}

export default TrailersSection
