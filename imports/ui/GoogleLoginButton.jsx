import React, { useState } from "react";
import { Meteor } from 'meteor/meteor';

export const GoogleLoginButton = () => {
    const [error , setError ] = useState('')

    //this function execute when the user push click in the button start session with google
    const handleGoogleLogin = () => {
        setError('')//claer the message after this sure that only show the new message

        Meteor.loginWithGoogle({//method proporcionadp por meteor para inicial el flujo de autenticacion de google que abrira un ventana emergente o se redirije al sitio de google para la AUTH necesaria  
            requestPermissions: ['email', 'profile'] // Permisos que solicitamos a Google para que nuesta app tenga acceso a la info basica del perfil
        }, (err) => {//funcion de callback que se ejecuta una vez termine el proceso de inicio con google ya se on exito o error del login si algo fallo
            if(err) {
                setError(err.reason || 'Error login session with Google')
                console.error('Error to login with Google', err)
            } else {
                // El login fue exitoso, Meteor.user() se actualizará automáticamente
                // y el componente App.jsx manejará la redirección
            }
        })
    }
    return (
        <div className="mt-4">
            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
            
            <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {/**código SVG->etiqueta principal para graficos vectoriales (Scalable Vector Graphics) que dibuja el icono de Google */}                
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44.5 20H24V28.5H35.5C34.7 32.5 31.5 35.5 24 35.5C17.5 35.5 12 30 12 24C12 17.5 17.5 12 24 12C27.5 12 30.5 13.5 32.5 15.5L38 10C34.5 6.5 29.5 4 24 4C13.5 4 5 12.5 5 24C5 35.5 13.5 44 24 44C34.5 44 43 35.5 43 24C43 22.5 42.8 21.2 42.5 20H44.5Z" fill="#4285F4"/>
                    <path d="M44.5 20L42.5 20L42.5 20.5H24V28.5H35.5C34.7 32.5 31.5 35.5 24 35.5C17.5 35.5 12 30 12 24C12 17.5 17.5 12 24 12C27.5 12 30.5 13.5 32.5 15.5L38 10C34.5 6.5 29.5 4 24 4C13.5 4 5 12.5 5 24C5 35.5 13.5 44 24 44C34.5 44 43 35.5 43 24C43 22.5 42.8 21.2 42.5 20Z" fill="url(#paint0_linear_1_1)"/>
                    {/**definenimos le color de gradier los stops definen los colores y la posciciones dentro del gradier */}
                    <defs>
                        <linearGradient id="paint0_linear_1_1" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FBBC04"/>
                        <stop offset="1" stopColor="#EA4335"/>
                        </linearGradient>
                    </defs>
                </svg>
                Start session with Google
            </button>
        </div>
    )
}