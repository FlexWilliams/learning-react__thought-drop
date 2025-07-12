import { useEffect, useRef, useState } from 'react'
import { debounceTime, Subject, take, tap, timer } from 'rxjs'
import ConfirmationModal from '../../modal/components/ConfirmationModal'
import ScratchpadTabs from '../../scratchpad/components/ScratchpadTabs'
import { StorageService } from '../../storage/storage-service'

export default function Main(props) {
  const [notes, setNotes] = useState([])

  const notesCount = useRef(notes.length)

  const [activeNote, setActiveNote] = useState(null)
  const activeNoteRef = useRef(null)

  const [noteIdToRemove, setNoteIdToRemove] = useState(null)

  const saveText$$ = new Subject()
  const saveText$ = saveText$$.asObservable()

  saveText$
    .pipe(
      debounceTime(500),
      tap(([text, cursorPosition, preventSaveHistory]) => {
        saveText(text, cursorPosition, preventSaveHistory)
      }),
    )
    .subscribe()

  useEffect(() => {
    props.saveTabTitle$
      .pipe(
        debounceTime(500),
        tap((title) => {
          saveTabTitle(title)
        }),
      )
      .subscribe()
  }, [props.saveTabTitle$])

  useEffect(() => {
    StorageService.getNotes().then((notesFromDb) => {
      console.debug(`Effect called`)

      let notes = notesFromDb.length === 0 ? [StorageService.createNote('New Tab')] : notesFromDb
      setNotes(notes)

      notesCount.current = notes.length
      updateActiveNote(notes[0])
    })
  }, [])

  function saveNote(note, preventTextAreaAutoFocus, preventSaveHistory) {
    StorageService.saveNote(note, preventSaveHistory).then((newNote) => {
      updateActiveNote(newNote, preventTextAreaAutoFocus)

      setNotes((currentNotes) => {
        const idx = currentNotes.findIndex((n) => n.id === newNote.id)
        if (idx === -1) {
          return [...currentNotes, newNote]
        } else {
          currentNotes[idx] = newNote

          return [...currentNotes]
        }
      })

      console.debug(`Finished saving note: ${newNote?.id}`)
    })
  }

  function saveText(text, cursorPosition, preventSaveHistory) {
    cursorPosition = cursorPosition ? cursorPosition : text?.length > 0 ? text.length - 1 : 0

    const note = {
      ...activeNote,
      updatedOn: new Date().toISOString(),
      text,
      cursorPosition,
    }

    saveNote(note, true, preventSaveHistory)
  }

  function saveTabTitle(title) {
    if (!activeNoteRef.current || !activeNoteRef.current.id) {
      return
    }

    saveNote(
      {
        ...activeNoteRef.current,
        title,
      },
      true,
    )
  }

  function getScratchPad() {
    const scratchpad = document.getElementsByName('scratchpad').item(0)
    if (!scratchpad) {
      console.error(`Scratchpad not found!`)
      return
    }

    return scratchpad
  }

  function handleChange() {
    const scratchpad = getScratchPad()
    saveText$$.next([scratchpad.value, scratchpad.selectionStart])
  }

  function handleConfirmationYes() {
    console.debug(`User selected yes`)

    let noteCount = notesCount.current

    StorageService.removeNote(noteIdToRemove).then(() => {
      if (noteCount === 1) {
        let note = StorageService.createNote()
        setNotes(() => {
          return [note]
        })
        updateActiveNote(note)
      } else {
        let idx = notes.findIndex((n) => n.id === noteIdToRemove)

        setNotes((currentNotes) => {
          return [...currentNotes.filter((n) => n.id !== noteIdToRemove)]
        })

        if (activeNote?.id === noteIdToRemove) {
          let newActiveNote = idx >= notes.length - 1 ? notes[notes.length - 2] : notes[idx - 1] // TODO: rework, looks ugly but needed because setNotes is async?? and propogates after this line...
          updateActiveNote(newActiveNote)
        }

        notesCount.current -= 1
      }

      setNoteIdToRemove(null)
      closePopover('confirmation')
    })
  }

  function handleConfirmationNo() {
    console.debug(`User selected no`)
    setNoteIdToRemove(null)
    closePopover('confirmation')
  }

  function handleRemoveNote(noteId) {
    setNoteIdToRemove(noteId)
    togglePopover('confirmation')
  }

  function updateActiveNote(note, preventTextAreaAutoFocus) {
    setActiveNote({ ...note })
    activeNoteRef.current = { ...note }
    setScratchPadValue(note, preventTextAreaAutoFocus)
    props.handleTabTitleChange(note?.title)
    props?.handleActiveNoteChange({ ...note })
  }

  function handleTabClick(element, noteId) {
    const note = notes.find((n) => n.id === noteId)
    updateActiveNote({ ...note })
    element?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  function setScratchPadValue(note, preventTextAreaAutoFocus) {
    const scratchpad = getScratchPad()

    if (!preventTextAreaAutoFocus) {
      scratchpad.focus()
    }
    scratchpad.value = note?.text
    scratchpad.setSelectionRange(note?.cursorPosition || 0, note?.cursorPosition || 0)
  }

  function updateCursorPosition() {
    const scratchpad = getScratchPad()
    saveText$$.next([scratchpad.value, scratchpad.selectionStart, true])
  }

  function handleClick() {
    updateCursorPosition()
  }

  function createNewNote(event) {
    let title = `Tab ${notes.length + 1}`

    StorageService.saveNewNote(title).then((newNote) => {
      setNotes((currentNotes) => {
        return [...currentNotes, newNote]
      })

      notesCount.current += 1

      updateActiveNote(newNote)

      timer(500)
        .pipe(
          take(1),
          tap(() => {
            event?.target?.scrollIntoView({ behavior: 'smooth', inline: 'end' })
          }),
        )
        .subscribe()
    })
  }

  function togglePopover(popoverId) {
    const popover = document.getElementById(popoverId)
    if (!popover) {
      return
    }

    popover?.togglePopover()
  }

  function closePopover(popoverId) {
    const popover = document.getElementById(popoverId)
    if (!popover) {
      return
    }

    popover?.hidePopover()
  }

  return (
    <main>
      {notes?.length > 0 ? (
        <ScratchpadTabs
          notes={[...notes]}
          activeNote={activeNote}
          handleTabClick={handleTabClick}
          handleRemoveNote={handleRemoveNote}
          createNewNote={createNewNote}
          includeCreateNewTabButton={true}
          keyId={'id'}
        />
      ) : (
        <></>
      )}
      <textarea name='scratchpad' onChange={handleChange} onClick={handleClick}></textarea>

      <ConfirmationModal handleYes={handleConfirmationYes} handleNo={handleConfirmationNo} />
    </main>
  )
}
