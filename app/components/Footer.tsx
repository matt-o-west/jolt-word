import { useContext } from 'react'
import { Context } from '~/root'
import Link from '@mui/material/Link'

const Footer = () => {
  const { theme } = useContext(Context)

  return (
    <footer
      className={`flex items-center justify-between w-full text-md p-2 py-8 mt-6 m-2 ${theme} 
  desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto 
  flex-col sm:flex-row phone:space-y-2`}
    >
      <span>
        made with {'\u2764\uFE0F'} by{' '}
        <Link
          href='https://github.com/matt-o-west'
          target='_blank'
          rel='noopener'
        >
          matt-o-west
        </Link>
      </span>
      <span className='flex gap-x-2'>
        powered by{' '}
        <img
          src='/images/mw-footer-logo.png'
          alt='merriam webster logo'
          title='merriam-webster api'
        />
      </span>
    </footer>
  )
}

export default Footer
