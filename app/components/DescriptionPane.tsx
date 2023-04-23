import React from 'react'

const Description = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center'>
      <div className='md:w-1/2 mb-8 md:mb-0'>
        <h2 className='text-3xl font-bold mb-4'>How does this work?</h2>
        <img
          className='w-full h-56 object-cover'
          src='https://via.placeholder.com/500'
          alt='Placeholder'
        />
      </div>
      <div className='md:w-1/2 md:ml-8'>
        <p className='text-lg'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          tincidunt magna non enim feugiat, vel sollicitudin odio eleifend.
          Suspendisse auctor, est nec fermentum ultricies, justo sapien interdum
          libero, quis volutpat diam lacus et tortor. Proin fermentum auctor
          imperdiet. Aenean faucibus nibh in tempor fringilla. Duis consequat,
          odio vel vehicula tempor, ipsum ante volutpat nisi, id cursus urna dui
          sed nunc.
        </p>
      </div>
    </div>
  )
}

export default Description
