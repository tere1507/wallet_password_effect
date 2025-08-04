import React, { useState } from "react";
import { Accounts } from 'meteor/accounts-base';

export const SignupForm = ({ onSwitchToLogin }) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [error, setError ] = useState('');
    const [successMessage, setSuccessMessage ] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para el botón de carga

    const validatePassword = (pwd) => {
        if(pwd.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        }
        // Puedes añadir más validaciones de fortaleza aquí (mayúsculas, números, símbolos)
        return null; // Devuelve null si la validación es exitosa
    };

    // La función handleSubmit ahora es asíncrona
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true); // Activar estado de carga

        if(!email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios.');
            setIsSubmitting(false);
            return;
        }

        if(password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsSubmitting(false);
            return;
        }

        const passwordError = validatePassword(password);
        if(passwordError) {
            setError(passwordError);
            setIsSubmitting(false);
            return;
        }

        try {
            // Usamos Accounts.createUserAsync para el registro asíncrono
            await Accounts.createUserAsync({ email, password });
            setSuccessMessage('¡Cuenta creada exitosamente! Iniciando sesión...');
            // No es necesario redirigir aquí, App.jsx manejará el cambio de vista automáticamente.
        } catch (err) {
            console.error('Error al registrar usuario:', err);
            setError(err.reason || 'Error al registrar usuario.');
        } finally {
            setIsSubmitting(false); // Desactivar estado de carga
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-100">Registrarse</h2> {/* Texto blanco/gris claro */}
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

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Contraseña
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-700 text-white" // Colores oscuros y focus verde
                    required
                />
                {password && validatePassword(password) && (
                    <p className="text-red-400 text-xs mt-1">{validatePassword(password)}</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                    Confirmar Contraseña
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-700 text-white" // Colores oscuros y focus verde
                    required
                />
                {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Las contraseñas no coinciden.</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed" // Botón verde
                disabled={isSubmitting} // Deshabilitar el botón durante la carga
            >
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-emerald-400 hover:text-emerald-300" // Enlace verde
                >
                    ¿Ya tienes una cuenta? Iniciar Sesión.
                </button>
            </div>
        </form>
    );
};
