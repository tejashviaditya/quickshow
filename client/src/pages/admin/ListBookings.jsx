import React from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import {dummyBookingData} from '../../assets/assets'
import {useState,useEffect} from 'react'
import dateFormat from '../../lib/dateFormat';


const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  }
  useEffect(()=>{
    getAllBookings();
  },[]);

  return !isloading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl overflow-x-auto mt-6">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap ">
          <thead>
            <tr className=" bg-primary/20 text-left text-white ">
               <th className="p-2 font-medium pl-5 ">User Name</th>
              <th className="p-2 font-medium ">Movie Name</th>
              <th className="p-2 font-medium ">Show Time</th>
              <th className="p-2 font-medium ">Seats</th>
              <th className="p-2 font-medium ">Amount</th>

            </tr>

          </thead>

          <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="bg-primary/10 border-b border-primary/10 even:bg-primary/20 hover:bg-primary/30 transition duration-300">
              <td className="p-2 min-w-45 pl-5  ">{booking.user.name}</td>

              <td className="p-2 ">{booking.show.movie.title}</td>
              <td className="p-2  ">{dateFormat(booking.show.showDateTime)}</td>
              
              <td className="p-2  ">{Object.keys(booking.bookedSeats).map(seat=>booking.bookedSeats[seat]).join(", ")}</td>
              <td className="p-2  ">{currency} {booking.amount}</td>
            </tr>
          ))}
          </tbody>  
          


        </table>

      </div>
    </>
  ) : <Loading/>
}

export default ListBookings
