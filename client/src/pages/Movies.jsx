import React from 'react'
import {dummyShowsData} from '../assets/assets'
import MovieCard from '../components/MovieCard'

const Movies = () => {
  return dummyShowsData.length> 0 ?(
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-24 xl:px-44  py-20 overflow-hidden  min-h-[80vh]'>

      <h1 className='text-lg font-medium my-4 '>Now Showing </h1>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
        {dummyShowsData.map((movie)=>(
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  ):(
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className='text-3xl font-bold text-center'>No Movie Available </h1>
    </div>
  )
}

export default Movies
