import React, { useState } from "react";
import { LoginForm } from './LoginForm'; 
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm} from './ForgotPasswordForm';
import { GoogleLoginButton } from './GoogleLoginButton';
import MatrixBackground from './MatrixBackground'; // Importa el nuevo componente de fondo

export const AuthLayout = () => {
    // Estado para controlar qué formulario se muestra
    const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgotPassword'

    const renderForm = () => {
        switch (currentView) {
            case 'login':
                return (
                    <>
                    <LoginForm
                        onSwitchToSignup={() => setCurrentView('signup')}
                        onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
                    />
                    <div className="mt-6 text-center text-gray-500">
                        <p>- O -</p>
                    </div>
                    <GoogleLoginButton />
                    </>
                );
            case 'signup':
                return (
                    <SignupForm
                        onSwitchToLogin={() => setCurrentView('login')}
                    />
                );
            case 'forgotPassword':
                return (
                    <ForgotPasswordForm 
                        onSwitchToLogin={() => setCurrentView('login')}
                    />
                );
            default:
                return (
                    <>
                    <LoginForm 
                        onSwitchToSignup={() => setCurrentView('signup')}
                        onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
                    />
                    <div className="mt-6 text-center text-gray-500">
                        <p>- O -</p>
                    </div>
                    <GoogleLoginButton />
                    </>
                );
            }
    };

    // Renderizado Principal del Componente AuthLayout
    return (
        // El div principal ahora es 'relative' y tiene 'overflow-hidden'
        // El MatrixBackground se posiciona 'absolute' dentro de él
        // El div del formulario tiene 'z-10' para estar por encima
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <MatrixBackground /> {/* Aquí se renderiza el fondo de matriz */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10 relative">
                {renderForm()}
            </div>
        </div>
    );
};
