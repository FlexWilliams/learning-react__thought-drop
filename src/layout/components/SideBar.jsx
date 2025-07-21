export default function SideBar(props) {
  const navItemTitles = ['Notes', 'Todos', 'Habits', 'Food & Recipes', 'Prayer List']

  const navItems = navItemTitles.map((n) => (
    <li key={n}>
      <button type='button' onClick={() => props?.handleNavItemClick(n)}>
        {n}
      </button>
    </li>
  ))

  return (
    <nav id='sidebar' className='sidebar'>
      <menu>{navItems}</menu>
      <button
        className='close'
        aria-label='Close sidebar'
        onClick={props?.handleCloseSidebar}
      ></button>
    </nav>
  )
}
