//it is react context api used to share data in whole applicatioon without using props drilling

import { createContext, useContext, useState,useEffect } from 'react';
import axios from 'axios';
import {useUser,useAuth} from '@clerk/clerk-react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';




axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; //base url of the backend server



export const AppContext = createContext(); //create context object a global box
export const AppProvider = ({ children }) => {  //provider is used to provide data to the children
    //childre is the data which is passed to the provider from the parent component
     
    const [isAdmin, setIsAdmin] = useState(false); //isAdmin is the state which is used to check if the user is admin or not
    const [shows, setShows] = useState([]); //shows is the state which is used to store the shows data
    const [favoriteMovies, setFavoriteMovies] = useState([]); //favoriteMovies is the state which is used to store the favorite movies data

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL; //base url for the images
    
    const {user}=useUser(); //clerk user object
    const {getToken} = useAuth(); //getting the token from the user
    const location = useLocation(); //getting the location from the url
    const navigate = useNavigate(); //navigate is used to navigate the user to the admin dashboard


    const fetchIsAdmin = async () => {   //fetching the isAdmin data from the backend
        const token = await getToken();

        console.log("CLERK TOKEN:", token);


        try {
            const {data} = await axios.get('/api/admin/is-admin',{headers:{'Authorization':`Bearer ${await getToken()}`}})
            console.log("IS ADMIN RESPONSE:", data);
            setIsAdmin(data.isAdmin);

            
            if(!data.isAdmin && location.pathname.startsWith('/admin')){ //we will navigate the user in admin dashboard if he is not admin
                    navigate('/');
                    toast.error('You are not authorized to access admin dashboard');

            }
        
        }
        catch (error) {
            console.log(error);
        }
    }
    //fetching the shows data from the backend
     const fetchShows = async () => {
        try {
            const {data} = await axios.get('/api/show/all');
            if(data.success){
                setShows(data.shows);
            }
            else{
                toast.error(data.message); //notifying the user if the request is not successful
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // fetching the favorite movies data from the backend
    const fetchFavoriteMovies = async () => {
        try {
            const {data} = await axios.get('/api/user/favorite',{headers:{'Authorization':`Bearer ${await getToken()}`}})
            if(data.success){
                setFavoriteMovies(data.movies);
            }
            else{
                toast.error(data.message);
            }
        }
         catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchShows();
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin();
            fetchFavoriteMovies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    const value = {axios
        ,fetchIsAdmin
        ,user,
        getToken
        ,navigate
        ,isAdmin,shows,fetchShows,favoriteMovies,fetchFavoriteMovies,image_base_url


    }


    return(
        <AppContext.Provider value={value}> 
            {children} 
        </AppContext.Provider>
    )
}
export const useAppContext=() => {
    return useContext(AppContext); //use context hook to get the data from the context
}   

//jaise koi movie agar axios backend se ayi to value of provider =movie and then use context hook se use karenge to movie ki value milegi