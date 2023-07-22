import React from 'react'

const Description = () => {
  return (
    <>
      <section className='flex flex-col md:flex-row justify-between items-center my-8'>
        <div className='md:w-1/2 mb-8 md:mb-0'>
          <h2 className='text-3xl font-bold my-8'>
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
            phrase that needs more recognition? Here, you can give those words
            the attention they deserve by giving them a Jolt!
          </p>
        </div>
      </section>
      <section className='flex flex-col md:flex-row justify-between items-center my-8'>
        <div className='md:w-1/2 mb-8 md:mb-0'>
          <h2 className='text-3xl font-bold mb-4'>Let's Give Words a Jolt!</h2>
          <p className='text-lg'>
            When you Jolt a word, you're giving it a vote and propelling it up
            in our rankings. Each session, you can Jolt a word up to a certain
            limit (your Jolt value). The more Jolts a word has, the higher it
            ranks on our main page, and the more likely it is to be discovered
            by other users. Want to track the words you've Jolted? Just sign in,
            and all your Jolted words are saved to your account!
          </p>
        </div>
        <div className='md:w-1/2 md:ml-8'>
          <img
            className='w-full h-56 object-cover'
            src='https://via.placeholder.com/500'
            alt='Placeholder'
          />
        </div>
      </section>
      <section className='flex flex-col md:flex-row justify-between items-center my-8'>
        <div className='md:w-1/2 mb-8 md:mb-0'>
          <img
            className='w-full h-56 object-cover'
            src='https://via.placeholder.com/500'
            alt='Placeholder'
          />
        </div>
        <div className='md:w-1/2 md:ml-8'>
          <h2 className='text-3xl font-bold mb-4'>
            The Leech: A Natural Balance
          </h2>
          <p className='text-lg'>
            In JoltWord, we believe in balance. That's where the Leech value
            comes in. Over the course of 12 hours, a word's votes will leech or
            decay by a certain amount. This ensures that no single word
            maintains dominance for too long and allows newer or less popular
            words a chance to shine.
          </p>
        </div>
      </section>
    </>
  )
}

export default Description
