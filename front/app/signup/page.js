"use client";

import React, { useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/auth/signup`, {
        email,
        password,
        username,
      });
      if (response.status == 201) {
        router.push('/login');
      } else {
        setError(response?.data?.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError(err?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <img src="/mistral.png" alt="Logo" className="logo" />
        <form onSubmit={handleSignup} className="form">
          <div className="form-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="label">Username</label>
            <input
              id="username"
              type="text"
              required
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password" className="label">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              required
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <p>Already registered ? <a href="/login" className="link">Login</a></p>
          <button type="submit" className="submit-btn">Signup</button>
        </form>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .content {
          width: 100%;
          max-width: 500px;
          text-align: center;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
          width: 40%;
          object-fit: contain;
          margin-bottom: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 18px;
          margin-bottom: 8px;
          text-align: left;
        }

        .input {
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          border-color: rgb(0, 130, 255);
        }

        .submit-btn {
          padding: 18px 24px;
          font-size: 18px;
          font-family: 'Roboto', sans-serif;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          border: none;
          background-color: rgb(0, 210, 255);
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: rgb(0, 190, 200);
        }

        .error {
          color: red;
          font-size: 16px;
          margin-top: -15px;
        }

        a {
          font-size: 16px;
          color: rgb(0, 130, 255);
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Signup;