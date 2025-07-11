import a from '../../assets/hamburger-icon.svg'

export default function Header() {
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
    </header>
  )
}
