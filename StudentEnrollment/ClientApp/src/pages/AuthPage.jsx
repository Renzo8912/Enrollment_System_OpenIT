import { useState } from 'react';

export const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        const endpoint = isLogin ? '/login?useCookies=true' : '/register';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                if (isLogin) {
                    onLoginSuccess();
                } else {
                    setMessage("Registration successful! Please login.");
                    setIsLogin(true); // Return to login page
                    setPassword('');
                }
            } else {
                setMessage(isLogin ? "Login failed. Check credentials." : "Registration failed. Password requires uppercase, number, and special character.");
            }
        } catch (error) {
            setMessage("Network error occurred.");
        }
    };

    return (
        <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="add-container" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center' }}>{isLogin ? "Sign In" : "Register"}</h2>
                
                {message && <div style={{ color: 'var(--red)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="form-group">
                    <label>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: '1rem' }} />
                    
                    <label>Password</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1.5rem' }} />
                    
                    <button type="submit" className="btn-submit">
                        {isLogin ? "Login" : "Create Account"}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
                        style={{ background: 'none', border: 'none', color: 'var(--navy)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>
        </main>
    );
};