import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';

function App() {
  const dispatch  = useDispatch()
  const location  = useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({ ...SummaryApi.getCategory })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (_) {}
    finally { dispatch(setLoadingCategory(false)) }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (_) {}
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  return (
    <GlobalProvider>
      <div className="min-h-screen flex flex-col bg-fashion-light">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
            },
            success: {
              style: { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
              iconTheme: { primary: '#22C55E', secondary: '#fff' },
            },
            error: {
              style: { background: '#FFF1F2', color: '#B91C1C', border: '1px solid #FECDD3' },
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </GlobalProvider>
  )
}

export default App
