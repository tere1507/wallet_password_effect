import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import { WalletLayout } from './WalletLayout';
import { AuthLayout } from './AuthLayout';
import { ResetPasswordForm } from './ResetPasswordForm';

export const App = () => {
    // ---------------------------------------------------
    // Estado del usuario y la sesión de Meteor.
    // ---------------------------------------------------
    const { user, isLoggingIn } = useTracker(() => {
        // Asegúrate de que el usuario esté suscrito si es necesario.
        // Aquí solo estamos obteniendo el estado de inicio de sesión.
        return {
            user: Meteor.user(),
            isLoggingIn: Meteor.loggingIn(),
        };
    });

    // ---------------------------------------------------
    // Lógica para manejar el token de restablecimiento de contraseña
    // ---------------------------------------------------

    // Función para obtener el token de la URL al cargar.
    const getInitialResetToken = () => {
        const path = window.location.pathname;
        if (path.startsWith('/reset-password/')) {
            // Extrae el token de la parte final de la URL
            return path.split('/').pop();
        }
        return null;
    };

    // Estado para guardar el token de restablecimiento.
    const [resetToken, setResetToken] = useState(getInitialResetToken());

    useEffect(() => {
        // Usa Accounts.onResetPasswordLink para detectar el token de manera nativa.
        const resetPasswordLinkHandler = Accounts.onResetPasswordLink((token, done) => {
            setResetToken(token);
            done();
        });

        // Event listener para manejar la navegación del navegador (botones back/forward)
        const handlePopState = () => {
            if (!window.location.pathname.startsWith('/reset-password/')) {
                setResetToken(null);
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Función de limpieza para eliminar los listeners al desmontar el componente.
        return () => {
            resetPasswordLinkHandler(); // Elimina el listener de Meteor
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); // El array vacío asegura que esto se ejecute solo una vez.

    // ---------------------------------------------------
    // Lógica de renderizado principal
    // ---------------------------------------------------
    
    // 1. Mostrar pantalla de carga.
    if (isLoggingIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }
    
    // 2. Si hay un token de restablecimiento activo, renderiza el formulario de restablecimiento.
    if (resetToken) {
        return <ResetPasswordForm token={resetToken} />;
    }

    // 3. Si el usuario está logueado, muestra el diseño principal de la cartera.
    if (user) {
        return <WalletLayout user={user} />;
    }

    // 4. Si el usuario no está logueado, muestra el diseño de autenticación.
    return <AuthLayout />;
};
