import React, { useState } from "react";
import { Meteor } from 'meteor/meteor';

export const LoginForm = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [error, setError ] = useState('');
    const [successMessage, setSuccessMessage ] = useState('');

    const handleSubmit = async (e) => { // Cambiado a async para usar await con Meteor.loginWithPasswordAsync
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if(!email || !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            return;
        }

        try {
            // Usamos Meteor.loginWithPasswordAsync para el inicio de sesión asíncrono
            await Meteor.loginWithPassword(email, password); // Meteor.loginWithPassword es asíncrono en Meteor 3.x
            // La redirección o mensaje de éxito es manejado por el componente padre (App.jsx)
            // ya que el estado del usuario cambia y App.jsx se re-renderiza.
        } catch (err) {
            setError(err.reason || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-100">Iniciar Sesión</h2> {/* Texto blanco/gris claro */}
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
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-700 text-white" // Colores oscuros y focus verde
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500" // Botón verde
            >
                Iniciar Sesión
            </button>

            <div className="text-center text-sm mb-10">
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="font-medium text-emerald-400 hover:text-emerald-300 mr-15 ml-12 mb-5" // Enlace verde
                >
                    ¿No tienes una cuenta aún?
                </button>

                <button
                    type="button"
                    onClick={onSwitchToForgotPassword}
                    className="font-medium text-emerald-400 hover:text-emerald-300 mr-4" // Enlace verde
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </form>
    );
};
