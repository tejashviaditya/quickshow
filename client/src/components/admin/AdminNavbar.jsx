import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Home } from 'lucide-react';

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to='/'>
        <img src={assets.logo} alt='logo' className='w-36 h-auto' />
      </Link>

      <Link
        to='/'
        onClick={() => scrollTo(0, 0)}
        className='flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dull hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-primary/30 transition-all duration-300 active:scale-95 hover:scale-105'
      >
        <Home className='w-4 h-4' />
        <span>Home</span>
      </Link>
    </div>
  );
};

export default AdminNavbar;