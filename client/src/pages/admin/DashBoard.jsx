import { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, Film, Users, Star, Calendar } from 'lucide-react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import BlurCircle from '../../components/BlurCircle';
import dateFormat from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { toast } from "react-hot-toast";

const DashBoard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY || '₹';

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: TrendingUp,
      color: "from-blue-500/20 to-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      title: "Total Revenue",
      value: `${currency} ${dashboardData.totalRevenue || 0}`,
      icon: IndianRupee,
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400",
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows?.length || "0",
      icon: Film,
      color: "from-primary/20 to-purple-500/10",
      iconColor: "text-primary",
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers || "0",
      icon: Users,
      color: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="relative pb-16">
      <BlurCircle top="-50px" left="0px" />
      <Title text1="Admin" text2="Dashboard" />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{card.value}</h3>
            </div>

            <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} border border-white/10 ${card.iconColor}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows Grid */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          Active Shows ({dashboardData.activeShows?.length || 0})
        </h2>

        {dashboardData.activeShows?.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center border border-white/10">
            <p className="text-gray-400 text-sm">No active shows scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dashboardData.activeShows?.map((show) => (
              <div
                key={show._id}
                className="group glass-card rounded-2xl overflow-hidden border border-white/10 p-3 flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-black/40 mb-3">
                  <img
                    src={image_base_url + (show.movie?.poster_path || show.movie?.backdrop_path || '')}
                    alt={show.movie?.title || 'Show Poster'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-amber-400 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {show.movie?.vote_average ? show.movie.vote_average.toFixed(1) : "0.0"}
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <h4 className="font-bold text-base text-white truncate group-hover:text-primary transition-colors">
                    {show.movie?.title || 'Movie Title'}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {dateFormat(show.showDateTime)}
                    </span>
                    <span className="font-extrabold text-sm text-primary">
                      {currency}{show.showPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
