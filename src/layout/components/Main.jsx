import Food from '../../food/component/food'
import Habits from '../../Habits/components/Habits'
import Notes from '../../notes/components/Notes'
import Prayers from '../../prayer/components/prayers'
import Todos from '../../Todos/components/Todos'

export default function Main(props) {
  return (
    <main>
      {props?.activeNavItem === 'Notes' && (
        <Notes
          saveTabTitle$={props.saveTabTitle$}
          handleTabTitleChange={props.handleTabTitleChange}
          handleActiveNoteChange={props.handleActiveNoteChange}
        />
      )}

      {props?.activeNavItem === 'Todos' && <Todos />}
      {props?.activeNavItem === 'Habits' && <Habits />}
      {props?.activeNavItem === 'Food & Recipes' && <Food />}
      {props?.activeNavItem === 'Prayer List' && <Prayers />}
    </main>
  )
}
