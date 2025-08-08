import React, { useState } from "react";
import { Accounts } from 'meteor/accounts-base';

export const ForgotPasswordForm = ({ onSwitchToLogin }) => {
    // Gestiona el estado del correo electrónico, mensajes de error y mensajes de éxito.
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón de carga

    // Valida el formato del correo electrónico ingresado por el usuario.
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        if (!email) {
            setError('Por favor, ingresa tu correo electrónico.');
            setIsSubmitting(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, ingresa una dirección de correo electrónico válida.');
            setIsSubmitting(false);
            return;
        }

        Accounts.forgotPassword({ email: email }, (err) => {
            if (err) {
                setError(err.reason || 'Error al enviar correo de recuperación.');
            } else {
                setSuccessMessage('El correo de recuperación ha sido enviado. Por favor, revisa tu bandeja de entrada.');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-100">Recuperar Contraseña</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-700 text-white"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Enviando...' : 'Enviar Correo de Recuperación'}
            </button>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-emerald-400 hover:text-emerald-300"
                >
                    Volver a Iniciar Sesión
                </button>
            </div>
        </form>
    );
};
