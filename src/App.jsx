import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import CursorGlow from './components/CursorGlow'
import Hero from './components/Hero'
import About from './components/About'
import Spotlight from './components/Spotlight'
import FilmStrip from './components/FilmStrip'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Admin from './components/Admin'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // hidden admin route — not linked anywhere on the site
  if (hash === '#admin' || hash === '#/admin') {
    return (
      <>
        <div className="grain" />
        <Admin />
      </>
    )
  }

  return (
    <>
      <div className="grain" />
      <CursorGlow />
      <Nav />
      <Hero />
      <FilmStrip blank flat />
      <Spotlight />
      <FilmStrip />
      <Gallery />
      <Events />
      <Contact />
      <About />
      <Footer />
      <BackToTop />
    </>
  )
}
