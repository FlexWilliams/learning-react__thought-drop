import NotesFooter from '../../notes/components/NotesFooter'

export default function Footer(props) {
  return (
    <footer>
      {props?.activeNavItem === 'Notes' && <NotesFooter showHistory={props?.showHistory} />}
    </footer>
  )
}
