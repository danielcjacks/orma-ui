import { GlobalProvider, ThemeState } from "@ladle/react"
import { createTheme } from "@mui/material/styles"
import { StyledEngineProvider, Theme, ThemeProvider } from "@mui/material"

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const theme = createTheme({
    palette: {
      mode: globalState.theme === ThemeState.Light ? "light" : "dark",
    },
  })

  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}
