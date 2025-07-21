import { useEffect } from 'react'
import menuIcon from '../../assets/hamburger-icon.svg'

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
        <button aria-label='Open Menu' onClick={props?.handleOpenSidebar}>
          <img src={menuIcon} alt='Menu Icon' />
        </button>
      </div>

      <h1>Thought Drops</h1>

      {props?.activeNavItem === 'Notes' && (
        <input name='tab-title' onChange={handleTabTitleChange} />
      )}
    </header>
  )
}
