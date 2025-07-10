import { debounceTime, Subject, take, tap, timer } from "rxjs";
import { StorageService } from "../../storage/storage-service";

export default function Main(props) {

    // TODO: deprecate
    const tabs = props.data.notes.map((n, idx) => {
        return (
            <li key={n.id}>
              <button className="tab">{n?.title || `Tab ${idx + 1}`}</button>
              <button aria-label="Close Tab" className="close-tab">X</button>
            </li>
        )
    });

    let selectedTab;

    const saveText$$ = new Subject();
    const saveText$ = saveText$$.asObservable();

    saveText$.pipe(debounceTime(500), tap((text) => {
        saveText(text);
    })).subscribe();

    timer(500).pipe(take(1), tap(async () => {
        const scratchpad = getScratchPad();

        let notes = await StorageService.getNotes();

        selectedTab = notes[0] || createNote();

        scratchpad.value = selectedTab.text;
    })).subscribe();

    function createNote() {
        const now = new Date().toISOString();
        return {
            id: crypto.randomUUID(),
            createdOn: now,
            updatedOn: now,
            text: ''
        };
    }

    function saveText(text) {
        console.debug(text);

        const note = {
            ...selectedTab,
            updatedOn: new Date().toISOString(),
            text
        };

        StorageService.saveNote(note).then(newNote => {
            console.debug(`Finished saving note: ${newNote?.id}`);
        });
    }

    function getScratchPad() {
        const scratchpad = document.getElementsByName('scratchpad').item(0);
        if (!scratchpad) {
            console.error(`Scratchpad not found!`);
            return;
        }

        return scratchpad;
    }

    function handleChange() {
        const scratchpad = getScratchPad();       
        saveText$$.next(scratchpad.value);
    }

    return (
      <main>
        <menu>
          <ul>
            {tabs}
            <li>
              <button aria-label="New Tab" className="tab">+</button>
            </li>
          </ul>
        </menu>

        <textarea name="scratchpad" onChange={handleChange}></textarea>
      </main>
    )
}