import { useRef, useState } from 'react'
import { Subject } from 'rxjs'
import './App.css'
import Footer from './layout/components/Footer'
import Header from './layout/components/Header'
import Main from './layout/components/Main'
import NoteHistory from './notes/components/NoteHistory'
import { StorageService } from './storage/storage-service'

function App() {
  const saveTabTitle$$ = new Subject()
  const saveTabTitle$ = saveTabTitle$$.asObservable()

  const [tabTitle, setTabTitle] = useState('New Tab')

  const [showNoteHistoryPanel, setShowNoteHistoryPanel] = useState(false)

  const activeNoteRef = useRef(null)

  StorageService.init()

  function handleTabTitleChange(title) {
    saveTabTitle$$.next(title)
  }

  function handleTabTitleChange2(title) {
    setTabTitle(title)
  }

  function showHistory() {
    setShowNoteHistoryPanel(true)
  }

  function hideHistory() {
    setShowNoteHistoryPanel(false)
  }

  function handleActiveNoteChange(note) {
    activeNoteRef.current = note
  }

  return (
    <>
      <Header tabTitle={tabTitle} handleTabTitleChange={handleTabTitleChange} />
      <Main
        saveTabTitle$={saveTabTitle$}
        handleTabTitleChange={handleTabTitleChange2}
        handleActiveNoteChange={handleActiveNoteChange}
      />
      <Footer showHistory={showHistory} />

      {showNoteHistoryPanel && (
        <NoteHistory noteId={activeNoteRef.current?.id} handleClose={hideHistory} />
      )}
    </>
  )
}

export default App
