import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";




const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };
  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className=" relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle top="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Booking</h1>
      {bookings.map((item, index) => (
        <div
          key={index}
          className=" flex flex-col md:flex-row justify-between  gap-4 max-w-3xl mt-4 p-2  bg-primary/8 border rounded-lg  border-primary/20 text-sm"
        >
          <div className="flex flex-col md:flex-row ">
            <img
              src={item.show.movie.poster_path}
              alt=''
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4 ">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
               <p className="text-xs text-gray-400">{timeFormat(item.show.movie.runtime)}</p>
               <p className="text-xs text-gray-400 mt-auto ">
                {dateFormat(item.show.showDateTime)}
              </p> 
            </div>
          </div>
          {/* booking details */}
          <div className="flex flex-col md:items-end md:text-right justify-between p-4 ">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">{currency}{item.amount}</p>
              {!item.isPaid && <button className="bg-primary px-4 py-1.5 mb-3 rounded-full font-medium cursor-pointer text-sm "> Pay Now</button>}
            </div>
            <div className="text-sm">
              <p><span className="text-gray-400">Total Amount</span> {item.bookedSeats.length}</p>
              <p> <span className="text-gray-400">Seat Number</span> {item.bookedSeats.join(", ")}</p>
            </div>

          </div>


        </div>
      ))}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBooking;
