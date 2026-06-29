import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Calendar from './pages/Calendar';
import Booking from './pages/Booking';
import OpenMic from './pages/OpenMic';
import Admin from './pages/Admin';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/open-mic" element={<OpenMic />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  );
}
