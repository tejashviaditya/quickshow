import React from 'react'
import {useState,useEffect} from 'react'
import {ChartLineIcon,CircleDollarSignIcon,PlayCircleIcon,Star,UserIcon} from 'lucide-react'
import {dummyDashboardData} from '../../assets/assets'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import BlurCircle from '../../components/BlurCircle'
import {assets} from '../../assets/assets'
import dateFormat from '../../lib/dateFormat'
import {StarIcon} from 'lucide-react'




const DashBoard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const[dashboardData,setDashboardData]=useState({
    totalBookings:0,
    totalRevenue:0,
    activeShows:[],
    totalUser:0
  });
  const [loading,setLoading]=useState(true); //after loading dashboard data it become false
  
  const dashboardCards=[
    {title:"Total Bookings",value:dashboardData.totalBookings || "0",icon:ChartLineIcon},
    {title:"Total Revenue",value:dashboardData.totalRevenue || "0",icon:CircleDollarSignIcon},
    {title:"Active Shows",value:dashboardData.activeShows.length || "0",icon:PlayCircleIcon},
    {title:"Total Users",value:dashboardData.totalUser || "0",icon:UserIcon}
  ]
  const fetchDashboardData=async()=>{
    setDashboardData(dummyDashboardData)
    setLoading(false)


  };
  useEffect(()=>{
    fetchDashboardData(); //to called before function
  },[])
   
  return !loading ? ( //when loading is false then  dev will display
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top='-100px' left='0px'/>
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card,index)=>(
            <div key={index} className="flex items-center justify-between px-4 py-3  gap-4  bg-primary/10 rounded-md border border-primary/20 max-w-50 w-full ">
               <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-5 h-5" />
          
            </div>
          ))}
        </div>

      </div>
      <p className="mt-10 text-lg font-medium">Active shows</p>
      <div className="relative flex flex-wrap gap-6 mt-6 max-w-5xl">
        <BlurCircle top='-100px' left='-10px'/>
        {dashboardData.activeShows.map((show)=>( //it will display active shows
          <div key={show._id} className="w-55 flex flex-col overflow-hidden h-full pb-3 border border-primary/20 bg-primary/20 hover:-translate-y-1 transition duration-300">
            <img src={show.movie.poster_path} alt="show" className="w-full h-60 object-cover" />
            <p className="font-medium mt-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between mt-2 gap-2">
              <p className="text-lg font-medium"> {currency} {show.showPrice}</p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 test-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-1">{dateFormat(show.showDateTime)}</p>
          </div>
        ))}

            
          

        

      </div>
    </>
  ):<Loading/>
}

export default DashBoard
