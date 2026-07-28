import React from 'react'
import { useParams } from 'react-router-dom';

const Loading = () => {
  return (
    <div className="flex  items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
      
    </div>
  )
}

export default Loading
