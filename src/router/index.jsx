import { Routes, Route } from 'react-router-dom';
import Layout from '../layout';
import HomePage from '../view/home/HomePage.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="workload" element={<HomePage />} />
                <Route path="users" element={<div>人员管理页面</div>} />
                <Route path="settings" element={<div>系统设置页面</div>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;