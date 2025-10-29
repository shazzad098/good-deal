import React from 'react';
import { useSelector } from 'react-redux';
import './Alert.css'; // Notun CSS file import

const Alert = () => {
    const alerts = useSelector(state => state.alert);

    // Jodi kono alert na thake, kichui render korbe na
    if (!alerts || alerts.length === 0) {
        return null;
    }

    // Global container e alert gulo map kore dekhano
    return (
        <div className="global-alert-container">
            {alerts.map(alert => (
                <div key={alert.id} className={`global-alert alert-${alert.type}`}>
                    {alert.msg}
                </div>
            ))}
        </div>
    );
};

export default Alert;