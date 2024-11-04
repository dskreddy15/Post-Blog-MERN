import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function register(ev) {
        ev.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to register: ${response.statusText}`);
            }
    
            const data = await response.json();
            alert("Registration successful")
            console.log('Registration successful:', data);
        } catch (error) {
            alert("Registration failed")
            console.error('Registration failed:', error);   
    
            // Handle error here, e.g., display an error message to the user
        }
    } 
    return(
        <div>
            <h1>REGISTER</h1>
            <form className="register" onSubmit={register}>
                <input  type = "text" 
                        placeholder="Username"
                        value = {username}
                        onChange = {(ev) => setUsername(ev.target.value)}/>
                <input  type = "email" 
                        placeholder="your@example.com"
                        value = {email}
                        onChange = {(ev) => setEmail(ev.target.value)}/>
                <input  type = "password" 
                        placeholder="password"
                        value = {password}
                        onChange = {(ev) => setPassword(ev.target.value)}/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}


//ErlVIlx0HvSElD0z