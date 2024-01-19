import {
  ThemeProvider as MUIThemeProvider,
  PaletteMode,
  Theme,
  createTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface IThemeContext {
  themeMode: PaletteMode
  changeThemeMode?: (themeMode: PaletteMode) => void
}

const ThemeContext = React.createContext<IThemeContext>({ themeMode: 'light' })

const { Consumer, Provider } = ThemeContext

interface IThemeProvider {
  children: React.ReactNode
}

const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
    },
    components: {
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            whiteSpace: 'pre',
          },
        },
      },
    },
  })

const THEME_MODE = 'THEME_MODE'

const ThemeProvider: React.FC<IThemeProvider> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<PaletteMode>('light')
  const [theme, setTheme] = useState<Theme>(getTheme('light'))

  useEffect(() => {
    const storedThemeMode = localStorage.getItem(THEME_MODE)
    const themeMode =
      storedThemeMode && ['dark', 'light'].includes(storedThemeMode)
        ? (storedThemeMode as PaletteMode)
        : 'light'
    setThemeMode(themeMode)
    setTheme(getTheme(themeMode))
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_MODE, themeMode)
    setTheme(getTheme(themeMode))
  }, [themeMode])

  const changeThemeMode = (themeMode: PaletteMode): void => {
    setThemeMode(themeMode)
  }

  return (
    <Provider value={{ changeThemeMode, themeMode }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </Provider>
  )
}

export { Consumer as ThemeConsumer, ThemeContext, ThemeProvider }
