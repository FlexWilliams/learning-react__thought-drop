import './App.css'
import Footer from './layout/components/Footer'
import Header from './layout/components/Header'
import Main from './layout/components/Main'
import { StorageService } from './storage/storage-service'

function App() {
  StorageService.init()

  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  )
}

export default App
