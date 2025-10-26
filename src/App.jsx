import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import IASNav from './components/IASNav'
import ScrollToTopButton from './components/ScrollToTopButton'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import WebAccountPage from './pages/WebAccountPage' // Main page for /webaccount
import Games from './pages/Games'
import Dictionary from './pages/Dictionary'
import Footer from './components/Footer'
import LessonCategory from './lessons/LessonCategory'
import SubCategoryContent from './lessons/SubCategoryContent'
import LessonPage from './lessons/LessonPage'
import SignFlip from './IASGames/SignFlip'
import SignQuest from './IASGames/SignQuest'
import SignSense from './IASGames/SignSense'
import { LanguageProvider } from './Languages/i18n2lang.jsx'
import Background from './components/Background'

// ScrollToTop component to handle scroll position on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <LanguageProvider>
      <Background />
      <ScrollToTop />
      <ScrollToTopButton />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <IASNav/>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path= '/' element={<Home/>} />
            <Route path='/lessons' element={<Lessons/>} />
            <Route path='/lessons/:categoryId' element={<LessonCategory/>} />
            <Route path='/lessons/:categoryId/:subCategoryId' element={<SubCategoryContent/>} />
            <Route path='/lessons/:categoryId/:subCategoryId/:contentId' element={<LessonPage/>} />
            {/* Use WebAccountPage for the /webaccount route */}
            <Route path='/webaccount' element={<WebAccountPage/>} />
            <Route path='/games' element={<Games/>} />
            <Route path='/games/sign-flip' element={<SignFlip/>} />
            <Route path='/games/sign-quest' element={<SignQuest/>} />
            <Route path='/games/sign-sense' element={<SignSense/>} />
            <Route path='/dictionary' element={<Dictionary/>} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </LanguageProvider>
  )
}

export default App