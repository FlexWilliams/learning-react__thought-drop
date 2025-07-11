export default function ScratchpadTabs(props) {
  const tabs = props.notes.map((n, idx) => {
    return (
      <li key={n.id} className={props?.activeNote?.id === n.id ? 'active' : ''}>
        <button className='tab' onClick={(e) => props.handleTabClick(e.target, n.id)}>
          {n?.title || `Tab ${idx + 1}`}
        </button>
        <button
          aria-label='Close Tab'
          className='close-tab'
          onClick={() => props.handleRemoveNote(n.id)}
        >
          X
        </button>
      </li>
    )
  })

  return (
    <menu>
      <ul>
        {tabs}
        <li>
          <button aria-label='New Tab' className='tab' onClick={props.createNewNote}>
            +
          </button>
        </li>
      </ul>
    </menu>
  )
}
