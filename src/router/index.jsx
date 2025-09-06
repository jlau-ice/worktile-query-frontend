import { Routes, Route } from 'react-router-dom';
import HomePage from '../view/home/HomePage.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
};

export default AppRoutes;