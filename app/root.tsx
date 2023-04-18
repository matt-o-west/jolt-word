import type { MetaFunction } from '@remix-run/node'
import { createContext, useState } from 'react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'
import type { ChangeEvent } from 'react'
import stylesheet from '~/tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'jolt-word',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

interface ContextType {
  font: string
  theme: string
  featureTheme: string
  toggleTheme: string
  isLoggedIn: boolean
  setUser: (user: string) => void
  setFont: (font: string) => void
  setTheme: (theme: string) => void
}

export const Context = createContext<ContextType>({
  font: 'sans-serif',
  theme: 'light',
  featureTheme: 'feature-light',
  toggleTheme: 'toggle-light',
  isLoggedIn: false,
  setUser: () => {},
  setFont: () => {},
  setTheme: () => {},
})

export default function App() {
  const [font, setFont] = useState('sans-serif')
  const [theme, setTheme] = useState('light')
  const [featureTheme, setFeatureTheme] = useState('feature-light')
  const [toggleSwitch, setToggleSwitch] = useState('toggle-light')
  const [user, setUser] = useState('')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    setFeatureTheme(
      featureTheme === 'feature-light' ? 'feature-dark' : 'feature-light'
    )
    setToggleSwitch(
      toggleSwitch === 'toggle-light' ? 'toggle-dark' : 'toggle-light'
    )
  }

  const toggleFont = (e: ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value)
  }

  return (
    <html lang='en' className={`${font} ${theme}`}>
      <head>
        <Meta />
        <Links />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <Context.Provider
          value={{
            font,
            theme,
            featureTheme,
            toggleTheme: toggleSwitch,
            user,
            setUser,
            setFont: toggleFont,
            setTheme: toggleTheme,
          }}
        >
          <Outlet />
        </Context.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
