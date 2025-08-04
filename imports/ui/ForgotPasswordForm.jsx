import React, { useState } from "react";
import { Accounts } from 'meteor/accounts-base';

export const ForgotPasswordForm = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón de carga

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // La función handleSubmit ahora es asíncrona
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true); // Activar estado de carga

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

        try {
            // Usamos Accounts.forgotPasswordAsync para el envío asíncrono
            await Accounts.forgotPasswordAsync({ email });
            
            setSuccessMessage('Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.');
            setEmail(''); // Limpiar el campo después de enviar
        } catch (err) {
            console.error('Error al enviar correo de recuperación:', err);
            setError(err.reason || 'Error al enviar correo de recuperación.');
        } finally {
            setIsSubmitting(false); // Desactivar estado de carga
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-100">Recuperar Contraseña</h2> {/* Texto blanco/gris claro */}
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-700 text-white" // Colores oscuros y focus verde
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed" // Botón verde
                disabled={isSubmitting} // Deshabilitar el botón durante la carga
            >
                {isSubmitting ? 'Enviando...' : 'Enviar Correo de Recuperación'}
            </button>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-emerald-400 hover:text-emerald-300" // Enlace verde
                >
                    Volver a Iniciar Sesión
                </button>
            </div>
        </form>
    );
};
