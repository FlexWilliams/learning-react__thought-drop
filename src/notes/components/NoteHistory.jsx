import { useEffect, useRef, useState } from 'react'
import ScratchpadTabs from '../../scratchpad/components/ScratchpadTabs'
import { StorageService } from '../../storage/storage-service'

function handleRemoveNote() {}

export default function NoteHistory(props) {
  // Duping code from Main.jsx, see if opportunity to centralize code...
  const [historicalNotes, setHistoricalNotes] = useState([])

  const notesCount = useRef(historicalNotes.length)

  const [activeNote, setActiveNote] = useState(null)
  const activeNoteRef = useRef(null)

  function handleTabClick(element, historyId) {
    const note = historicalNotes.find((n) => n.historyId === historyId)
    updateActiveNote({ ...note })
    element?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  function handleRemoveNote() {}

  function getScratchPad() {
    const scratchpad = document.getElementsByName('scratchpad-note-history').item(0)
    if (!scratchpad) {
      console.error(`Scratchpad not found!`)
      return
    }

    return scratchpad
  }

  function setScratchPadValue(note, preventTextAreaAutoFocus) {
    if (!note) {
      return
    }

    const scratchpad = getScratchPad()

    if (!preventTextAreaAutoFocus) {
      scratchpad.focus()
    }
    scratchpad.value = note?.text
    scratchpad.setSelectionRange(note?.cursorPosition || 0, note?.cursorPosition || 0)
  }

  function updateActiveNote(note) {
    setActiveNote({ ...note })
    activeNoteRef.current = { ...note }
    setScratchPadValue(note)
  }

  useEffect(() => {
    StorageService.getHistoricalNotes(props?.noteId).then((notesFromDb) => {
      console.debug(`[NoteHistory] Effect called`)
      let notes = notesFromDb ?? []
      setHistoricalNotes(notes)

      notesCount.current = notes.length
      updateActiveNote(notes[0])
    })
  }, [])

  return (
    // TODO: review, not sure if article is the most appropriate semantic element
    <article className='note-history'>
      <header></header>

      <div>
        {historicalNotes?.length > 0 ? (
          <ScratchpadTabs
            notes={[...historicalNotes]}
            activeNote={activeNote}
            handleTabClick={handleTabClick}
            handleRemoveNote={handleRemoveNote}
            keyId={'historyId'}
            showDateTitle={true}
          />
        ) : (
          <></>
        )}

        {historicalNotes?.length === 0 && <p>No previous note revisions exist for this note.</p>}

        <textarea name='scratchpad-note-history' disabled={true}></textarea>
      </div>

      <footer>
        <button className='restore'>Restore?</button>
        <button className='close' onClick={props?.handleClose}>
          Close
        </button>
      </footer>
    </article>
  )
}
