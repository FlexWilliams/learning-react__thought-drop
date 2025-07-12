import { StorageService } from '../../storage/storage-service'

export default function Footer(props) {
  function exportData() {
    StorageService.exportData()
      .then((data) => {
        const content = JSON.stringify(data, null, 2)
        const date = new Date().toLocaleDateString().replace(/\//g, '-')
        const time = new Date().toLocaleTimeString().replace(/:/g, '-').replace(' ', '_')
        var a = document.createElement('a')
        var file = new Blob([content], { type: 'application/json' })
        a.href = URL.createObjectURL(file)
        a.download = `thought-drops-export_${date}_${time}.json`
        a.click()
      })
      .catch((error) => {
        console.error(`Error exporting data`)
      })
  }

  return (
    <footer>
      <button className='history' onClick={props?.showHistory}>
        History
      </button>
      <button className='export' onClick={exportData}>
        Export
      </button>
      <button className='attach'>Attach</button>
    </footer>
  )
}
