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
import stylesheet from '~/tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

interface ContextType {
  font: string
  theme: string
  featureTheme: string
  isLoggedIn: boolean
  setFont: (font: string) => void
  setTheme: (theme: string) => void
  setLogin: () => void
}

export const Context = createContext<ContextType>({
  font: 'sans-serif',
  theme: 'light',
  featureTheme: 'feature-light',
  isLoggedIn: false,
  setFont: () => {},
  setTheme: () => {},
  setLogin: () => {},
})

export default function App() {
  const [font, setFont] = useState('sans-serif')
  const [theme, setTheme] = useState('light')
  const [featureTheme, setFeatureTheme] = useState('feature-light')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const updateFont = (newFont: string) => {
    setFont(newFont)
  }

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme === 'light' ? 'light' : 'dark')
    setFeatureTheme(
      newTheme === 'feature-light' ? 'feature-light' : 'feature-dark'
    )
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <html lang='en' className={`font-${font} ${theme}`}>
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
            isLoggedIn,
            setFont: updateFont,
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
