import { useState } from 'react'
import './App.css'
import Footer from './layout/components/Footer'
import Header from './layout/components/Header'
import Main from './layout/components/Main'
import { StorageService } from './storage/storage-service'
import { Subject } from 'rxjs'

function App() {
  const saveTabTitle$$ = new Subject()
  const saveTabTitle$ = saveTabTitle$$.asObservable()

  const [tabTitle, setTabTitle] = useState('New Tab')

  StorageService.init()

  function handleTabTitleChange(title) {
    saveTabTitle$$.next(title)
  }

  function handleTabTitleChange2(title) {
    setTabTitle(title)
  }

  return (
    <>
      <Header tabTitle={tabTitle} handleTabTitleChange={handleTabTitleChange} />
      <Main saveTabTitle$={saveTabTitle$} handleTabTitleChange={handleTabTitleChange2} />
      <Footer />
    </>
  )
}

export default App
