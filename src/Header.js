import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./usercontext";
import { useContext } from "react";

export default function Header(){
    const {userInfo, setUserInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile',{
            credentials:'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    const username = userInfo?.username;


    function logout(){
        fetch('http://localhost:4000/logout',{
            credentials:'include',
            method:'POST',
        });
        setUserInfo(null);
    }


    return (    
    <header>
        <Link to="/" className = "Logo">My Blog</Link>
        <nav>
            {username && (
                <>
                <span> Hello, {username}</span>
                <Link to="/create"> Create New Post </Link>
                <a onClick={logout}>Logout</a>
                </>
            )}
            {!username && (
                <>
                <Link to="/login" >Login</Link>
                <Link to="/register" >Register</Link>
        
                </>
            )}
            </nav>
    </header>
    );
}