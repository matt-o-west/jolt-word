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
  isLoggedIn: boolean
  setFont: (font: string) => void
  setTheme: (theme: string) => void
  setLogin: () => void
}

export const Context = createContext<ContextType>({
  font: 'sans-serif',
  theme: 'light',
  isLoggedIn: false,
  setFont: () => {},
  setTheme: () => {},
  setLogin: () => {},
})

export default function App() {
  const [font, setFont] = useState('sans-serif')
  const [theme, setTheme] = useState('light')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const updateFont = (newFont: string) => {
    setFont(newFont)
  }

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme === 'light' ? 'light' : 'dark')
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Context.Provider
          value={{
            font,
            theme,
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
