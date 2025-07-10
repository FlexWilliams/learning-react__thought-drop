export default function Main() {
    return (
      <main>
        <menu>
          <ul>
            <li>
              <button className="tab">Tab 1</button>
              <button aria-label="Close Tab" className="close-tab">X</button>
            </li>
            <li>
              <button aria-label="New Tab" className="tab">+</button>
            </li>
          </ul>
        </menu>

        <textarea name="scratchpad"></textarea>
      </main>
    )
}