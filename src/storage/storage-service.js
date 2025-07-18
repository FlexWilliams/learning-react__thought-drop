import localforage from 'localforage'

export class StorageService {
  static init() {
    localforage.config({
      driver: localforage.INDEXEDDB,
      name: 'thoughtdrops',
      version: 1.0,
      size: 1073741824, // 1GB
      storeName: 'thought_drops',
      description: 'App store',
    })
  }

  static getData() {
    return {
      notes: [
        {
          id: '8e3fc74d-b7fa-4c7f-b581-7a9125aed1a6',
          title: 'My Note',
          createdOn: '2025-07-10T22:38:30.307Z',
          updatedOn: '2025-07-10T22:38:30.307Z',
          text: `My text`,
        },
      ],
    }
  }

  static getNotes() {
    return localforage
      .getItem(`NOTES`)
      .then((existingNotes) => {
        return existingNotes && existingNotes.length > 0 ? existingNotes : []
      })
      .catch((error) => {
        console.error(`Error fetching notes ${error}`)
      })
  }

  static getHistoricalNotes(noteId) {
    return localforage
      .getItem(`NOTES.${noteId}`)
      .then((existingNotes) => {
        return existingNotes && existingNotes.length > 0 ? existingNotes : []
      })
      .catch((error) => {
        console.error(`Error fetching notes ${error}`)
      })
  }

  static saveNotes(newNotes) {
    return localforage
      .setItem(`NOTES`, newNotes)
      .then((notes) => {
        return notes
      })
      .catch((error) => {
        console.error(`Error saving notes: ${error}`)
      })
  }

  static saveNewNote(title) {
    return this.saveNote(this.createNote(title))
  }

  static getNoteHistory(noteId) {
    return localforage
      .getItem(`NOTES.${noteId}`)
      .then((notes) => {
        return notes || []
      })
      .catch((error) => {
        console.error(`Error getting historical notes: ${error}`)
      })
  }

  static saveNoteToHistory(note, preventSaveHistory) {
    if (preventSaveHistory) {
      return Promise.resolve()
    }

    return this.getNoteHistory(note.id)
      .then((notes) => {
        return localforage
          .setItem(`NOTES.${note.id}`, [note, ...notes])
          .then((historicalNotes) => {
            return historicalNotes
          })
          .catch((error) => {
            console.error(`Error saving historical notes: ${error}`)
          })
      })
      .catch((error) => {
        console.error(`Error saving historical notes: ${error}`)
      })
  }

  static saveNote(note, preventSaveHistory) {
    note = {
      ...note,
      historyId: crypto.randomUUID(),
    }

    return this.saveNoteToHistory(note, preventSaveHistory)
      .then(() => {
        return this.getNotes()
          .then((existingNotes) => {
            const existingNoteIndex = existingNotes.findIndex((e) => e.id === note.id)

            if (existingNoteIndex !== -1) {
              note = {
                ...existingNotes[existingNoteIndex],
                ...note,
              }
              existingNotes[existingNoteIndex] = note
            } else {
              if (!note.id) {
                note.id = crypto.randomUUID()
              }

              existingNotes.push(note)
            }
            return this.saveNotes(existingNotes)
              .then((notes) => {
                return notes.find((n) => n.id === note.id)
              })
              .catch((error) => {
                console.error(`Error saving note: ${error}`)
              })
          })
          .catch((error) => {
            console.error(`Error saving note: ${error}`)
          })
      })
      .catch((error) => {
        console.error(`Error saving note`)
      })
  }

  static removeNote(noteId) {
    return this.getNotes()
      .then((existingNotes) => {
        if (!noteId || !existingNotes || existingNotes.length === 0) {
          console.warn(`Unable to remove note in DB, DNE.`)
          return
        }

        let notes = existingNotes.filter((e) => e.id !== noteId)

        return this.saveNotes(notes)
          .then()
          .catch((error) => {
            console.error(`Error saving note: ${error}`)
          })
      })
      .catch((error) => {
        console.error(`Error saving note: ${error}`)
      })
  }

  static exportData() {
    const items = [this.getNotes()]

    return Promise.all(items)
      .then((results) => {
        return {
          notes: results[0],
        }
      })
      .catch((error) => {
        console.error(`Error exporting data: ${error}`)
      })
  }

  static createNote(title) {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      title,
      createdOn: now,
      updatedOn: now,
      text: '',
    }
  }
}
