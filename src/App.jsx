import './App.css';
import Footer from './layout/components/Footer';
import Header from './layout/components/Header';
import Main from './layout/components/Main';
import { StorageService } from './storage/storage-service';

function App() {

  StorageService.init();

  const data = StorageService.getData();

  return (
    <>
      <Header />
      <Main data={data} />
      <Footer />
    </>
  )
}

export default App
