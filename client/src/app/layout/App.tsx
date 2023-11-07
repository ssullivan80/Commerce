import { useEffect, useState } from "react";
import Header from "./Header";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import agent from "../api/agent";
import { getCookie } from "../util/util";
import LoadingComponent from "./LoadingComponents";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";

function App() {  
  const dispatch = useAppDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    console.log(`getting basket ${buyerId}`);

    if (buyerId) {
      console.log("getting basket")
      agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));      
    } else {
      setLoading(false);
    }
  }, [dispatch])

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
