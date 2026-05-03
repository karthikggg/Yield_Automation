import logo from './logo.svg';
import './App.css';
import { Header } from './components/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RATESAPPLY } from './pages/ratesApply';
import { QC } from './pages/qc';
import { EPISODESCHANGE } from './pages/episodesChange';
import { IC } from './pages/ic';


function App() {
  return (
    <div className="App">
      <Header />
     
        <Routes>
          <Route path="/episodes-change" element={<EPISODESCHANGE />} />
          <Route path="/rates-apply" element={<RATESAPPLY />} />
          <Route path="/qc" element={<QC />} />
          <Route path="/ic" element={<IC />} />
        </Routes>
     
    </div>
  );
}



export default App;
