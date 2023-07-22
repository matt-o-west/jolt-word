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
          <h2 className='text-3xl font-bold mb-4'>Leech: Striking A Balance</h2>
          <p className='text-lg'>
            Over the course of 12 hours, a word's votes will leech or decay by a
            certain amount. This ensures that no single word maintains dominance
            for too long and allows newer or less popular words a chance to
            shine.
          </p>
        </div>
      </section>
      <section className='flex-col w-full'>
        <h2 className='text-3xl font-bold mb-4'>Next Features</h2>
        <div className='mb-8 md:mb-0'>
          <p className='text-lg'>
            This is a demo app currently, but we have a lot of ideas for future
            features! You'll find some below:
          </p>
          <ul className='list-disc list-inside py-4 ml-6'>
            <li>
              <strong>Occasional Bugs in Parsing of API Tokens:</strong> There
              are edge cases still where certain structures of the API tokens
              means they are not parsed correctly, although this is more seldom
              than not it can lead to strange interactions once and awhile.
            </li>
            <li>
              <strong>AI Suggestions:</strong> We would like to add a feature
              where users can interact with OpenAI or another API to prompt
              example sentences with the word of the day, matching a selected
              mood, tone, genre or in the style of famous writers.
            </li>
            <li>
              <strong>Mood Words or Phrases for Users:</strong> Add a selection
              of mood words for users to choose from to describe them on the
              given day, via their profile, or compose a sentence.
            </li>
            <li>
              <strong>Social Feed and Friend Connections:</strong> The previous
              feature could tie into larger social features and a social feed,
              where users can see what other users/friends are feeling and how
              they are using the word of the day.
            </li>
            <li>
              <strong>Word of the Day Archive:</strong> We would like to create
              an archive of past words of the day.
            </li>
            <li>
              <strong>Word of the Day Email:</strong> We would like to send
              users an email with the word of the day.
            </li>
            <li>
              <strong>Rate-Limiting and Spam Prevention:</strong> Add
              rate-limiting and spam prevention to the word voting system. This
              is a demo app so did not implement this feature prior to gathering
              feedback, but it would be necessary for a production app.
            </li>
          </ul>
          <p className='text-lg'>
            If you come back later, you may find some of these features
            implemented, or a poll on the landing page allowing users to vote on
            future roadmap initiatives. In the mean time, happy Jolting!
          </p>
        </div>
      </section>
    </>
  )
}

export default Description
