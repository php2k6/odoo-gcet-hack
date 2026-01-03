import React, { useState } from 'react';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeProfile from './EmployeeProfile';

export default function EmployeeApp() {
    const [currentView, setCurrentView] = useState('dashboard');

    return (
        <div>
            {currentView === 'dashboard' && (
                <EmployeeDashboard onNavigate={setCurrentView} />
            )}
            {currentView === 'profile' && (
                <EmployeeProfile onBack={() => setCurrentView('dashboard')} />
            )}
        </div>
    );
}
