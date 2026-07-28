import React from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const DateSelect = ({dateTime,id}) => {
    const navigate=useNavigate();
    const [selected,setSelected]=useState(null)
    const onBookHandler=()=>{ 
      if(!selected){
        return toast('please select a date first',{icon:'⚠️'})
      }
      navigate(`/movies/${id}/${selected}`)
      scrollTo(0,0) 
    }

  return (
    <div id="dateSelect" className='pt-30 px-6 md:px-16 lg:px-24 xl:px-44  py-20 overflow-hidden'>
        <div className='flex flex-col items-center justify-between md:flex-row gap-10 relative p-8 bg-primary/10 rounded-lg  md:gap-12 mx-auto ' >
         <BlurCircle top='-100px' left='-100px'/>
          <BlurCircle top='100px' right='0px'/> 
          <div> 
            <p className='text-lg font-semibold'>Choose Date</p>
            <div className='flex items-center gap-4 text-sm mt-4'>
                <ChevronLeftIcon width={20} />
                <span className='grid grid-cols-3 gap-4 md:flex flex-wrap md:max-w-lg '>
                    {Object.keys(dateTime).map((date)=>(
                        <button onClick={()=>setSelected(date)} key={date} className={`flex flex-col items-center justify-center h-14 w-14 aspect-square cursor-pointer ${selected===date ? 'bg-primary text-white font-semibold rounded-lg' :  ' rounded-lg border border-primary/70' }`}>
                        <span>{new Date(date).getDate()}</span>
                        <span>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
                        </button>
                        ))}
     
                </span>
                <ChevronRightIcon width={20} />
              
             
            </div>
          </div>
          <button onClick={onBookHandler} className='px-10 py-3 text-small bg-primary  hover:bg-primary-dull transition rounded-md font-medium cursor-pointer 
            active:scale-95 '>Book Now</button> 
          

        </div>

      
    </div>
  )
}


export default DateSelect
