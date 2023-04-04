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
  setFont: (font: string) => void
  setTheme: (theme: string) => void
  setLogin: () => void
}

export const Context = createContext<ContextType>({
  font: 'sans-serif',
  theme: 'light',
  featureTheme: 'feature-light',
  toggleTheme: 'toggle-light',
  isLoggedIn: false,
  setFont: () => {},
  setTheme: () => {},
  setLogin: () => {},
})

export default function App() {
  const [font, setFont] = useState('sans-serif')
  const [theme, setTheme] = useState('light')
  const [featureTheme, setFeatureTheme] = useState('feature-light')
  const [toggleSwitch, setToggleSwitch] = useState('toggle-light')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <html lang='en' className={`${font} ${theme}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Context.Provider
          value={{
            font,
            theme,
            featureTheme,
            toggleTheme: toggleSwitch,
            isLoggedIn,
            setFont: toggleFont,
            setTheme: toggleTheme,
            setLogin: handleLogin,
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
