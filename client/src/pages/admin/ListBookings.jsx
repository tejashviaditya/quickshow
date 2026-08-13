import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { useState, useEffect } from 'react';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';


const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', { headers: { 'Authorization': `Bearer ${await getToken()}` } });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
              <tr key={booking._id || index} className="bg-primary/10 border-b border-primary/10 even:bg-primary/20 hover:bg-primary/30 transition duration-300">
                <td className="p-2 min-w-45 pl-5  ">{booking.user?.name || "N/A"}</td>
                <td className="p-2 ">{booking.show?.movie?.title || "N/A"}</td>
                <td className="p-2  ">{booking.show?.showDateTime ? dateFormat(booking.show.showDateTime) : "N/A"}</td>
                <td className="p-2  ">{Array.isArray(booking.bookedSeats) ? booking.bookedSeats.join(", ") : ""}</td>
                <td className="p-2  ">{currency} {booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />;
};

export default ListBookings;
