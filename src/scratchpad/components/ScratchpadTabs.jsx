export default function ScratchpadTabs(props) {
  const tabs = props.notes.map((n, idx) => {
    function getDateTitle(updatedOn) {
      const date = new Date(updatedOn).toLocaleDateString()
      const time = new Date(updatedOn).toLocaleTimeString()
      return `${date}\n${time}`
    }

    return (
      <li
        key={n[props.keyId]}
        className={props?.activeNote[props.keyId] === n[props.keyId] ? 'active' : ''}
      >
        <button
          className={`tab ${props?.showDateTitle ? 'date-title' : ''}`}
          onClick={(e) => props.handleTabClick(e.target, n[props.keyId])}
        >
          {props?.showDateTitle ? getDateTitle(n.updatedOn) : n?.title || `Tab ${idx + 1}`}
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
        {props?.includeCreateNewTabButton && (
          <li>
            <button aria-label='New Tab' className='tab' onClick={props.createNewNote}>
              +
            </button>
          </li>
        )}
      </ul>
    </menu>
  )
}
