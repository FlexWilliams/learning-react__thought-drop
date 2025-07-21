import { useRef, useState } from 'react'
import { Subject, take, tap, timer } from 'rxjs'
import './App.css'
import Footer from './layout/components/Footer'
import Header from './layout/components/Header'
import Main from './layout/components/Main'
import SideBar from './layout/components/SideBar'
import NoteHistory from './notes/components/NoteHistory'
import { StorageService } from './storage/storage-service'

function App() {
  const saveTabTitle$$ = new Subject()
  const saveTabTitle$ = saveTabTitle$$.asObservable()

  const [activeNavItem, setActiveNavItem] = useState('Notes')

  const [tabTitle, setTabTitle] = useState('New Tab')

  const [showSideBar, setShowSideBar] = useState(false)

  const [showNoteHistoryPanel, setShowNoteHistoryPanel] = useState(false)

  const activeNoteRef = useRef(null)

  StorageService.init()

  function handleTabTitleChange(title) {
    saveTabTitle$$.next(title)
  }

  function updateTabTitle(title) {
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

  function handleCloseSidebar() {
    setShowSideBar(false)
  }

  function handleOpenSidebar() {
    setShowSideBar(true)

    timer(250)
      .pipe(
        take(1),
        tap(() => {
          const menuItem = document.querySelector('#sidebar menu li button')
          if (menuItem) {
            menuItem.focus()
          }
        }),
      )
      .subscribe()
  }

  function handleNavItemClick(navItem) {
    console.debug(`User navigating to: ${navItem}`)
    setTabTitle('New Tab') // Clear tab title
    setActiveNavItem(navItem)
    setShowSideBar(false)
  }

  return (
    <>
      <Header
        tabTitle={tabTitle}
        handleTabTitleChange={handleTabTitleChange}
        handleOpenSidebar={handleOpenSidebar}
        activeNavItem={activeNavItem}
      />
      <Main
        saveTabTitle$={saveTabTitle$}
        handleTabTitleChange={updateTabTitle}
        handleActiveNoteChange={handleActiveNoteChange}
        activeNavItem={activeNavItem}
      />
      <Footer showHistory={showHistory} activeNavItem={activeNavItem} />

      {showSideBar && (
        <SideBar
          handleCloseSidebar={handleCloseSidebar}
          handleNavItemClick={handleNavItemClick}
          activeNavItem={activeNavItem}
        />
      )}

      {showNoteHistoryPanel && (
        <NoteHistory noteId={activeNoteRef.current?.id} handleClose={hideHistory} />
      )}
    </>
  )
}

export default App
