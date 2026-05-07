import logo from './logo.svg';
import './App.css';
import { Header } from './components/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RATESAPPLY } from './pages/ratesApply';
import { QC } from './pages/qc';
import { EPISODESCHANGE } from './pages/episodesChange';
import { IC } from './pages/ic';
import { HashRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <HashRouter basename="/Yield_Automation">
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
