export default function ConfirmationModal(props) {
  return (
    <>
      <dialog id='confirmation' popover='auto'>
        <h3>{props?.message || 'Confirm'}</h3>

        <button onClick={props?.handleYes}>Yes</button>
        <button onClick={props?.handleNo}>No</button>
      </dialog>
    </>
  )
}
