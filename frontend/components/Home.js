import React from 'react'
import pizza from './images/pizza.jpg'
import { useNavigate } from 'react-router-dom'


function Home() {
  const navigate = useNavigate()

   

  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}
      <button style={{background: 'none', border: 'none'}}>
        <img alt="order-pizza" 
        style={{ cursor: 'pointer' }} 
        src={pizza} 
        type='submit'
        onClick={() => navigate('/order')} />
      </button>
    </div>
  )
}

export default Home
