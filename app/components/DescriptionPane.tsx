import React from 'react'

const Description = () => {
  return (
    <section className='flex flex-col md:flex-row justify-between items-center'>
      <div className='md:w-1/2 mb-8 md:mb-0'>
        <h2 className='text-3xl font-bold mb-4'>
          Welcome to JoltWord, the Social Dictionary!
        </h2>
        <img
          className='w-full h-56 object-cover'
          src='https://via.placeholder.com/500'
          alt='Placeholder'
        />
      </div>
      <div className='md:w-1/2 md:ml-8'>
        <p className='text-lg'>
          <span className='text-bold text-purple'>JoltWord</span> is a unique
          dictionary app where your vote helps shape the world of words. Ever
          found a word that particularly resonated with you? Or discovered a
          phrase that needs more recognition? Here, you can give those words the
          attention they deserve by giving them a Jolt!
        </p>
      </div>
    </section>
  )
}

export default Description
