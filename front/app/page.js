"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="container">
      <div className="content">
        <img src="/mistral.png" alt="Logo" className="logo" />

        <div className="buttons">
          <button className="login-btn" onClick={handleLoginClick}>
            J'ai déjà un compte
          </button>
          <button className="signup-btn" onClick={handleSignupClick}>
            Je m'inscris
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .content {
          position: relative;
          max-width: 500px;
          width: 100%;
          height: 30%;
          text-align: center;
        }

        .logo {
          width: 90%;
          object-fit: contain;
          margin-bottom: 20px;
        }

        .buttons {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }

        .login-btn,
        .signup-btn {
          padding: 18px 24px;
          font-size: 20px;
          font-family: 'Roboto', sans-serif;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease;
          width: 48%;
        }

        .login-btn {
          background-color: rgb(0, 130, 255);
        }

        .signup-btn {
          background-color: rgb(0, 210, 255);
        }

        .login-btn:hover {
          background-color: rgb(0, 110, 200);
        }

        .signup-btn:hover {
          background-color: rgb(0, 190, 200);
        }
      `}</style>
    </div>
  );
}
