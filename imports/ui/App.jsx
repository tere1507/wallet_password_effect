import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { WalletLayout } from './WalletLayout';
import { AuthLayout } from './AuthLayout';
import { ResetPasswordForm } from './ResetPasswordForm'; // Suponiendo que tienes este componente

export const App = () => {
    const { user, isLoggingIn } = useTracker(() => {
        return {
            user: Meteor.user(),
            isLoggingIn: Meteor.loggingIn(),
        };
    });

    const isResetPasswordRoute = window.location.pathname.startsWith('/reset-password/');

    if (isLoggingIn) {
        return <div>Loading...</div>;
    }

    // Lógica para manejar la ruta de restablecimiento de contraseña
    if (isResetPasswordRoute) {
        const token = window.location.pathname.split('/')[2];
        return <ResetPasswordForm token={token} />;
    }

    // Lógica normal de autenticación
    if (user) {
        return <WalletLayout user={user} />;
    } else {
        return <AuthLayout />;
    }
};
