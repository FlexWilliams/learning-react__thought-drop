import { useEffect, useRef, useState } from 'react'
import { debounceTime, Subject, take, tap, timer } from 'rxjs'
import ConfirmationModal from '../../modal/components/ConfirmationModal'
import ScratchpadTabs from '../../scratchpad/components/ScratchpadTabs'
import { StorageService } from '../../storage/storage-service'

export default function Main() {
  const [notes, setNotes] = useState([])

  const notesCount = useRef(notes.length)

  const [activeNote, setActiveNote] = useState(null)

  const [noteIdToRemove, setNoteIdToRemove] = useState(null)

  const saveText$$ = new Subject()
  const saveText$ = saveText$$.asObservable()

  saveText$
    .pipe(
      debounceTime(500),
      tap((text) => {
        saveText(text)
      }),
    )
    .subscribe()

  useEffect(() => {
    StorageService.getNotes().then((notesFromDb) => {
      console.debug(`Effect called`)

      const scratchpad = getScratchPad()
      scratchpad.focus()

      let note = notesFromDb[0] || StorageService.createNote()
      setNotes(() => (notesFromDb.length === 0 ? [note] : notesFromDb))

      notesCount.current = notesFromDb.length

      setActiveNote(() => note)

      const text = note?.text

      scratchpad.value = text

      scratchpad.setSelectionRange(text?.length, text?.length)
    })
  }, [])

  function saveText(text) {
    console.debug(text)

    const note = {
      ...activeNote,
      updatedOn: new Date().toISOString(),
      text,
    }

    StorageService.saveNote(note).then((newNote) => {
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
    saveText$$.next(scratchpad.value)
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
        setActiveNote({ ...note })
      } else {
        let idx = notes.findIndex((n) => n.id === noteIdToRemove)

        setNotes((currentNotes) => {
          return [...currentNotes.filter((n) => n.id !== noteIdToRemove)]
        })

        if (activeNote?.id === noteIdToRemove) {
          let newActiveNote = idx >= notes.length - 1 ? notes[notes.length - 2] : notes[idx]
          setActiveNote(newActiveNote)
          setScratchPadValue(newActiveNote?.text)
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

  function handleTabClick(element, noteId) {
    const note = notes.find((n) => n.id === noteId)
    setActiveNote({ ...note })
    setScratchPadValue(note?.text)
    element?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  function setScratchPadValue(text) {
    const scratchpad = getScratchPad()
    scratchpad.focus()

    scratchpad.value = text

    scratchpad.setSelectionRange(text.length, text.length)
  }

  function createNewNote(event) {
    let title = `Tab ${notes.length + 1}`

    StorageService.saveNewNote(title).then((newNote) => {
      setNotes((currentNotes) => {
        return [...currentNotes, newNote]
      })

      notesCount.current += 1

      setActiveNote({ ...newNote })
      setScratchPadValue(newNote?.text)

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
        />
      ) : (
        <></>
      )}
      <textarea name='scratchpad' onChange={handleChange}></textarea>

      <ConfirmationModal handleYes={handleConfirmationYes} handleNo={handleConfirmationNo} />
    </main>
  )
}
