import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {dummyShowsData,dummyDateTimeData} from '../assets/assets'
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import Loading from '../components/Loading';
import { ArrowRightIcon, Clock10Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isoTimeFormat from '../lib/isoTimeFormat';
import {assets} from '../assets/assets';
import toast from "react-hot-toast";



const Seatlayout = () => {
  const groupRows=[['A','B'],['C','D'],['E','F'],['G','H'],['I','J']]
  const {id,date}= useParams();
  const[selectedSeats,setSelectedSeats]=useState([]);
  const[selectedTime,setSelectedTime]=useState(null);
  const[show,setShow]=useState(null); 

  const navigate=useNavigate(); //to open a new page when user clicks on book now button 
  const getShow=async()=>{
    const show =dummyShowsData.find((show)=>show.id===Number(id));
    if(show){
    setShow({
      movie:show,
      dateTime:dummyDateTimeData})
    }
  }
  //for seat
  const handleSeatClick=(seatId)=>{
    if(!selectedTime){ //we have selected time
      return toast("Please Select time first")
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast("you can only select 5 seats")

    }
    //for again selecting seat
    setSelectedSeats(prev=>prev.includes(seatId)? prev.filter(seat=>seat !==seatId): [...prev,seatId]) 
  }
  // for selecting seats
  const renderSeats=(row,count=9)=>(
    <div key={row} className="flex gap-2 mt-2">
      <div className='flex flex-wrap items-center  justify-center gap-2 '>
        {Array.from({length:count },(_,i)=>{ 
          const seatId =`${row}${i+1}`; //row no +1 eg A1 B2
          return (
            <button key={seatId} onClick={()=>handleSeatClick(seatId) }
              className={`h-8 w-8 rounded border border-primary/40  cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary text-white" } `} >
                {seatId}
            </button>
              
          )
        })}

      </div>

    </div>
  )

  

  useEffect(()=>{
    getShow();
  },[] )

  return show ? (
    <div className="flex flex-col md:flex-row  px-6 md:px-16 lg:px-40 py-30 md:pt-50  ">
      {/* Available Times */}
      <div className='w-60 bg-primary/10 rounded-lg py-10 border border-primary/20 px-6 md:sticky md:top-20 md:self-start'>
        <p className='text-lg font-semibold px-6'>Available Time</p>
          <div className='mt-5 space-y-1 '>
            {show.dateTime[date].map((item)=>(
              <div className={`flex items-center gap-2 px-6 py-3 mt-4 transition  cursor-pointer rounded-lg ${selectedTime===item.time ? 'bg-primary text-white font-semibold' : 'bg-transparent border border-primary/20'}`} onClick={()=>setSelectedTime(item.time)} key={item.time}>
                <Clock10Icon className='w-5 h-5 '/>
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div> 
                  
             
            ))}
          </div>
           

      </div>

      {/* seat layout */}
      <div className=' relative flex-1 flex flex-col items-center max-md:mt-16  '>
        <BlurCircle top='-100px' left='-100px'/>
        <BlurCircle bottom='0px' right='0px'/>
        <h1 className='text-2xl font-semibold mb-4'>Select Seats</h1>
         <img src={assets.screenImage} alt='screen' /> 
        <p className='text-sm mb-6 text-gray-400'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1  gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row=>renderSeats(row))}
            
          
          </div>
           {/* now we have to divide seats in two part */}
         <div className='grid grid-cols-2 gap-11  '>
          {groupRows.slice(1).map((group,idx)=>(
            <div key={idx}>
              {group.map(row=>renderSeats(row))}
            </div>
            
          ))}

         </div >
       </div>
       <button onClick={()=>navigate('/my-bookings')} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull
       transition rounded-full font-medium cursor-pointer active:scale-95'>
         Proceed To Checkout
         <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/> 
       </button>
         
        


      </div>


    </div>
  ) : (
    <Loading/>

  )
}

export default Seatlayout
