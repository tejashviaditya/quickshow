import { useState, useEffect } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';


const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, getToken, user } = useAppContext();

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", { headers: { 'Authorization': `Bearer ${await getToken()}` } });
      if (data.success) {
        setShows(data.shows);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl overflow-x-auto gap-4 mt-6">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap ">
          <thead>
            <tr className=" bg-primary/20 text-left text-white ">
              <th className="p-2 font-medium pl-5 ">Movie Name</th>
              <th className="p-2 font-medium ">Show Time</th>
              <th className="p-2 font-medium ">Total Bookings</th>
              <th className="p-2 font-medium ">Earning</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show, index) => {
              const bookingsCount = Object.keys(show.occupiedSeats || {}).length;
              return (
                <tr key={show._id || index} className="bg-primary/10 border-b border-primary/10 even:bg-primary/20 hover:bg-primary/30 transition duration-300">
                  <td className="p-2 min-w-45 pl-5  ">{show.movie?.title || "N/A"}</td>
                  <td className="p-2 font-medium ">{dateFormat(show.showDateTime)}</td>
                  <td className="p-2 font-medium ">{bookingsCount}</td>
                  <td className="p-2 font-medium ">{currency} {bookingsCount * show.showPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />;
};

export default ListShows;