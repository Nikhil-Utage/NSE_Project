import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import NiftyAll from './TableData.jsx/NiftyAll';
import Nifty500 from './TableData.jsx/Nifty500';
import FO from './TableData.jsx/F&O';
import Nifty50 from './TableData.jsx/Nifty50';
import NiftyBank from './TableData.jsx/NiftyBank';
import MyAgGrid from './TableData.jsx/newdata';

const Home = () => {
    return (
        <Router>
            <div>
                <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
                    <Navbar />
                </div>
                <div className="p-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/nifty-all" />} />
                        <Route path="/nifty-all" element={<NiftyAll />} />
                        <Route path="/nifty-500" element={<Nifty500 />} />
                        <Route path="/fo" element={<FO />} />
                        <Route path="/nifty-50" element={<Nifty50 />} />
                        <Route path="/nifty-bank" element={<NiftyBank />} />
                        
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                   
                </div>
            </div>
        </Router>
    );
};

export default Home;
