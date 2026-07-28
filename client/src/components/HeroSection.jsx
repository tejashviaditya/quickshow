import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, Clock11Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate=useNavigate()
  return (
    <div className='flex flex-col items-start justify-center  gap-8 px-6 md:px-16 lg:px-36 bg-[url("https://images.hdqwalls.com/download/2026-avengers-doomsday-7z-1366x768.jpg")] bg-cover bg-center h-screen'>
        {/* <img src={assets.marvelLogo} alt="max-h-11 lg:h-11 mt-20 "/> */}
        <img src="https://cdn.marvel.com/content/1x/avengersdoomsday_lob_log_def_02.webp" alt="Logo" className='-mt-13 -ml-20' />
        <div className=" flex items-center gap-3 ml-1 -mt-10 text-gray-300 " >
            <span className='text-[18px]'>Action| Adventure | Scifi</span>
            <div className='flex items-center gap-2'>
              <Calendar1Icon className='w-7 h-6'/> 2026
             </div>

             <div className='flex items-center gap-2'>
              <Clock11Icon className='w-7 h-6'/> 2h 45m
             </div>
            </div>
            <p className='max-w-md text-gray-300'>In Avengers: Doomsday, Earth's mightiest heroes face their most dangerous challenge as Doctor Doom emerges with the power to reshape reality itself. As the multiverse falls into chaos, old allies reunite and new heroes rise. Together, they must battle overwhelming forces to protect countless worlds from destruction.</p>
            <button onClick={()=>navigate('/movies')} className='flex items-center gap-1  mt-8 px-6 py-3 text-4sm bg-primary rounded-full font-medium cursor-pointer hover:scale-95 transition '>
                Explore Movies
                <ArrowRight className='w-5 h-5 '/>
            </button> 
            {/* after clicking it open page==>Movie card */}
    </div>
  )
}

export default HeroSection