import './App.css';
import { Header } from './components/header';
import { BrowserRouter as  Routes, Route } from 'react-router-dom';
import { IC } from './pages/ic';
import { HashRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <HashRouter>
      <Header />
        <Routes>
          {/* <Route path="/episodes-change" element={<EPISODESCHANGE />} />
          <Route path="/rates-apply" element={<RATESAPPLY />} />
          <Route path="/qc" element={<QC />} /> */}
          <Route path="/" element={<IC />} />
        </Routes>
      </HashRouter>
     
    </div>
  );
}



export default App;
