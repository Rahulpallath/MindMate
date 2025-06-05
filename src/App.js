import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MindMateLanding from './components/MindMateLanding';
import MindMate from './components/MindMate';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MindMateLanding />} />
        <Route path="/chat" element={<MindMate />} />
        {/* Redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
