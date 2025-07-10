import localforage from 'localforage';

export class StorageService {
    static init() {
        localforage.config({
            driver      : localforage.INDEXEDDB,
            name        : 'thoughtdrops',
            version     : 1.0,
			size        : 1073741824, // 1GB
            storeName   : 'thought_drops',
            description : 'App store'
        });
    }

    static getData() {
        return {
            notes: [
                {
                    id: '8e3fc74d-b7fa-4c7f-b581-7a9125aed1a6',
                    title: 'My Note',
                    createdOn: '2025-07-10T22:38:30.307Z',
                    updatedOn: '2025-07-10T22:38:30.307Z',
                    text: `My text`
                }
            ]
        }
    }

    static getNotes() {
        return localforage.getItem(`NOTES`).then((existingNotes) => {
            return existingNotes ?? [];
        }).catch(error => {
            console.error(`Error fetching notes ${error}`);
        })
    }

    static saveNotes(newNotes) {
        return localforage.setItem(`NOTES`, newNotes).then(notes => {
            return notes;
        }).catch(error => {
            console.error(`Error saving notes: ${error}`);
        })
    }

    static saveNote(note) {
        return this.getNotes().then((existingNotes) => {

            const existingNoteIndex = existingNotes.findIndex(e => e.id === note.id);
  
            if (existingNoteIndex !== -1) {
                note = {
                    ...existingNotes[existingNoteIndex],
                    updatedOn: note.updatedOn,
                    text: note.text
                }
                existingNotes[existingNoteIndex] = note;

            } else {
                if (!note.id) {
                    note.id = crypto.randomUUID();
                }

                existingNotes.push(note);
            }
            return this.saveNotes(existingNotes).then(notes => {
                return notes.find(n => n.id === note.id);
            }).catch(error => {
                console.error(`Error saving note: ${error}`);
            })

        }).catch(error => {
            console.error(`Error saving note: ${error}`);
        });
    }

    static exportData() {
        const items = [
            this.getNotes()
        ];

        return Promise.all(items).then((results) => {
            return {
                notes: results[0]
            }
        }).catch(error => {
            console.error(`Error exporting data: ${error}`);
        })
    }
}