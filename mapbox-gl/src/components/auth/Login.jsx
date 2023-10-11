import { useRef, useState, useEffect } from 'react';
import '../../assets/css/auth-css/login.css';
import axios from 'axios';
import Room from "@mui/icons-material/Room";
import Cancel from "@mui/icons-material/Cancel";

export default function Login({ setShowLogin, setCurrentUser }) {
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const nameRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (isLocked) {
            if (remainingTime > 0) {
                const timer = setInterval(() => {
                    const currentRemainingTime = remainingTime - 1;
                    setRemainingTime(currentRemainingTime);
                    setError(`Too many login attempts. Please wait ${currentRemainingTime} seconds.`);
                }, 1000);

                return () => {
                    clearInterval(timer);
                };
            } else {
                setIsLocked(false);
                setAttempts(0);
                setRemainingTime(0);
                setError('');
            }
        }
    }, [isLocked, remainingTime]);

    useEffect(() => {
        if (attempts >= 5 && !isLocked) {
            setIsLocked(true);
            setRemainingTime(60);
        }
    }, [attempts, isLocked]);

    async function handleLoginSuccess(username, token) {
        // Save the token to local storage.
        localStorage.setItem('token', token);

        // Set the user's session.
        setCurrentUser(username);

        // Close the login form.
        setShowLogin(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isLocked) {
            setError(`Too many login attempts. Please wait ${remainingTime > 0 ? remainingTime : 'a few'} seconds.`);
            return;
        }

        const username = nameRef.current.value;
        const password = passwordRef.current.value;

        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const User = {
            username,
            password,
        };

        try {
            const res = await axios.post("/api/users/login", User);

            // Assuming the server sends a token upon successful login.
            const { token } = res.data;

            // Handle successful login with username and token.
            handleLoginSuccess(username, token);
        } catch (err) {
            setError('Invalid username or password. Please try again.');
            console.error("Login error:", err);
            nameRef.current.value = '';
            passwordRef.current.value = '';
            setAttempts(attempts + 1);
        }
    }

    function handleInputChange() {
        setError('');
    }

    return (
        <div className='auth login-container'>
            <div className="logo">
                <Room />
                PH Map GL
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='username'
                    ref={nameRef}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    placeholder='password'
                    ref={passwordRef}
                    onChange={handleInputChange}
                />
                <input type="submit" value={"Log in"} />
                {error && <span className='error'>{error}</span>}
            </form>
            <Cancel className='cancelBtn' onClick={() => setShowLogin(false)} />
        </div>
    );
}
