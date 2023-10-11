import { useRef, useState, useEffect } from 'react';
import '../../assets/css/auth-css/register.css'
import axios from 'axios';
import Room from "@mui/icons-material/Room";
import Cancel from "@mui/icons-material/Cancel";

export default function Register({ setShowRegister, setCurrentUser }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    useEffect(() => {
        // Add an event listener to the confirm password input
        const handleConfirmPasswordChange = () => {
            if (passwordRef.current.value !== confirmPasswordRef.current.value) {
                setPasswordMismatch(true);
            } else {
                setPasswordMismatch(false);
            }
        };

        const confirmPasswordInput = confirmPasswordRef.current;

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', handleConfirmPasswordChange);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (confirmPasswordInput) {
                confirmPasswordInput.removeEventListener('input', handleConfirmPasswordChange);
            }
        };
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post("/api/users/register", newUser);
            setError(false);
            setSuccess(true);
            setPasswordMismatch(false);

            // Set the currentUser state after successful registration
            setCurrentUser(newUser.username);
            setShowRegister(false);
        } catch (err) {
            setError(true);
            console.log("error on : " + err);
        }
    }

    return (
        <div className='auth register-container'>
            <div className="logo">
                <Room />
                PH Map GL
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' ref={nameRef} />
                <input type="email" placeholder='email' ref={emailRef} />
                <input type="password" placeholder='password' ref={passwordRef} />
                <input type="password" placeholder='confirm password' ref={confirmPasswordRef} />
                <input type="submit" value={"Register"} />
                {success && (
                    <span className='success'>Successfully Registered.</span>
                )}
                {error && (
                    <span className='error'>Something went wrong..</span>
                )}
                {passwordMismatch && (
                    <span className='error'>Passwords do not match.</span>
                )}
            </form>
            <Cancel className='cancelBtn' onClick={() => setShowRegister(false)} />
        </div>
    );
}
