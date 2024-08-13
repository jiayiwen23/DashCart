import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from "./AuthDebugger.module.css";

const AuthDebugger = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                setToken(accessToken);
            } catch (e) {
                console.error('Error getting token', e);
                setError('Failed to retrieve the token. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            getToken();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    if (!isAuthenticated) {
        return <div className={styles.notAuthenticatedMessage}>Please login to see your authentication token.</div>;
    }

    return (
        <div className={styles.authDebugger}>
            <h2>Auth Token Debugger</h2>
            <h3>Your authentication token:</h3>
            {token ? (
                <textarea readOnly value={token} style={{ width: '95%', height: '200px' }} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AuthDebugger;
