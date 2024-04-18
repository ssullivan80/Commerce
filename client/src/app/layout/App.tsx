import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from "./LoadingComponents";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsyn } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {  
  const dispatch = useAppDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const initApp =  useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsyn());
    } catch(error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then((() => setLoading(false)));
  }, [initApp])

  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette:{
      mode: paletteType,
      background: {
        default: paletteType ==='light' ? '#eaeaea' : '#121212'
      }
    }
  }) 

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) {
    <LoadingComponent message="Initializing app..." />
  }

  return (    
   <ThemeProvider theme={theme}>  
   <ToastContainer position="bottom-right" hideProgressBar theme="colored" />  
   <CssBaseline />
    <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
    <Container>
      <Outlet />   
    </Container>
    
   </ThemeProvider>
  )
}

export default App
