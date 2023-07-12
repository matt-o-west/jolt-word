import type { MetaFunction } from '@remix-run/node'
import { createContext, useState, useEffect } from 'react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'
import stylesheet from '~/tailwind.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserId } from '~/utils/session.server'
import Nav from '~/components/Nav'
import Footer from '~/components/Footer'

import { db } from 'prisma/db.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'jolt-word',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

interface ContextType {
  theme: string
  featureTheme: string
  toggleTheme: string
  //isLoggedIn: boolean
  user: string
  setUser: (user: string) => void
  //setFont: (font: string) => void
  setTheme: (theme: string) => void
}

export const Context = createContext<ContextType>({
  theme: 'light',
  featureTheme: 'feature-light',
  toggleTheme: 'toggle-light',
  //isLoggedIn: false,
  user: '',
  setUser: () => {},
  //setFont: () => {},
  setTheme: () => {},
})

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A445ED',
    },
    secondary: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: 'Work Sans',
  },
})

export async function loader({ request }: LoaderArgs) {
  const redirectTo = '/login'
  const loggedInUser = await requireUserId(request, redirectTo)
  const user = loggedInUser
    ? await db.user.findUnique({
        where: {
          id: loggedInUser,
        },
      })
    : null

  return json({
    loggedInUser,
    user,
    ENV: {
      API_KEY_DICTIONARY: process.env.API_KEY_DICTIONARY,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
  })
}

export default function App() {
  //const [font, setFont] = useState('sans-serif')
  const [theme, setTheme] = useState('light')
  const [featureTheme, setFeatureTheme] = useState('feature-light')
  const [toggleSwitch, setToggleSwitch] = useState('toggle-light')
  const [user, setUser] = useState('')
  const data = useLoaderData<typeof loader>()
  const location = useLocation()
  const showNav = !['/login', '/register'].includes(location.pathname)

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') || 'dark'
    setTheme(localTheme)

    const localFeatureTheme =
      window.localStorage.getItem('feature-theme') || 'feature-dark'
    setFeatureTheme(localFeatureTheme)

    const localToggleSwitch =
      window.localStorage.getItem('toggle-theme') || 'toggle-dark'
    setToggleSwitch(localToggleSwitch)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    const newFeatureTheme =
      featureTheme === 'feature-light' ? 'feature-dark' : 'feature-light'
    setFeatureTheme(newFeatureTheme)
    localStorage.setItem('feature-theme', newFeatureTheme)

    const newToggleSwitch =
      toggleSwitch === 'toggle-light' ? 'toggle-dark' : 'toggle-light'
    setToggleSwitch(newToggleSwitch)
    localStorage.setItem('toggle-theme', newToggleSwitch)
  }

  /*const toggleFont = (e: ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value)
  }*/

  return (
    <html lang='en' className={`${theme}`}>
      <head>
        <Meta />
        <Links />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Work+Sans:wght@300;400;500;600&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <Context.Provider
          value={{
            theme,
            featureTheme,
            toggleTheme: toggleSwitch,
            user,
            setUser,
            //setFont: toggleFont,
            setTheme: toggleTheme,
          }}
        >
          <ThemeProvider theme={muiTheme}>
            {showNav && (
              <Nav loggedInUser={data.loggedInUser} user={data.user} />
            )}
            <Outlet />
            {showNav && <Footer />}
          </ThemeProvider>
        </Context.Provider>
        <ScrollRestoration />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />

        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
