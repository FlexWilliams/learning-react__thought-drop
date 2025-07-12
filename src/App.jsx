import { useState } from 'react'
import './App.css'
import Footer from './layout/components/Footer'
import Header from './layout/components/Header'
import Main from './layout/components/Main'
import { StorageService } from './storage/storage-service'

function App() {
  const [tabTitle, setTabTitle] = useState('New Tab')

  StorageService.init()

  function handleTabTitleChange(title) {
    setTabTitle(title)
  }

  return (
    <>
      <Header tabTitle={tabTitle} handleTabTitleChange={handleTabTitleChange} />
      <Main tabTitle={tabTitle} handleTabTitleChange={handleTabTitleChange} />
      <Footer />
    </>
  )
}

export default App
