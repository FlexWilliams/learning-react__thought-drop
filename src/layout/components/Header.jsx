import { useEffect } from 'react'
import a from '../../assets/hamburger-icon.svg'
import Notification from '../../notification/components/Notification'

export default function Header(props) {
  useEffect(() => {
    const input = document.getElementsByName('tab-title')?.item(0)
    if (input) {
      input.value = props?.tabTitle
    }
  }, [props.tabTitle])

  function handleTabTitleChange(event) {
    const value = event?.target?.value
    props.handleTabTitleChange(value)
  }

  return (
    <header>
      <div className='menu'>
        <button>
          <img src={a} alt='' />
        </button>
        <menu>
          <ul>
            <li>Todos</li>
            <li>Groceries</li>
            <li>Notes</li>
          </ul>
        </menu>
      </div>
      <h1>Thought Drops</h1>
      <input name='tab-title' onChange={handleTabTitleChange} />

      <Notification />
    </header>
  )
}
