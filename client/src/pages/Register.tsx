import React from 'react';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { Navbar } from '../components/Navigation/Navbar';

export const Register: React.FC = () => {
  return (
    <div>
      <Navbar />
      <RegisterForm />
    </div>
  );
}