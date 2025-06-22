import React from 'react';
import { LoginForm } from '../components/Auth/LoginForm';
import { Navbar } from '../components/Navigation/Navbar';

export const Login: React.FC = () => {
  return (
    <div>
      <Navbar />
      <LoginForm />
    </div>
  );
};