import React, { useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';

// El componente ahora recibe 'token' como una prop
export const ResetPasswordForm = ({ token }) => { //desestructuración de props->espera recibir una unica propiedad de su componente padre ahora es-> App.jsx es quien le pasa el token obtenido de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);//isSubmitting-->booleana-> indica si el proceso de envio de reset esta en curso, como inicia en false significa que no hay ningun proceso en curso

  // La validación del token es directa, ya que viene como prop.
  useEffect(() => {
    if (!token) {//si token tiene valor null, undefinied, cadena vacia o cualquier valor falso entonces llamamos a la function serError
      setError('Token no válido o no encontrado. Por favor, usa el enlace completo del correo.');
    }
  }, [token]);//El useEffect o efecto se ejecutará cada vez que cambie el valor de token y se valide el nuevo

  const handleSubmit = (e) => {//definimos la funcion handleSubmit que se activara cuando el formulario sea enviado
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Token de restablecimiento de contraseña no proporcionado.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    //si todas las validaciones pasan, se establece isSubmitting a true , visualmente desactiva el boton de envio ya que la operacion esta en curso
    setIsSubmitting(true);

    //si todas las validaciones anteriores son falsas activamos el metodo de Meteor para restablecer the password
    //Esta es la llamada a la API de Meteor para restablecer la contraseña.
    Accounts.resetPassword(token, newPassword, (err) => {
      setIsSubmitting(false);//dentro del callback estabelcemos setIsSubmitting a false que habilita el boton de envio asi el form haya tenido exito o haya fallado
      if (err) {
        setError(err.reason || 'Error al restablecer la contraseña. El enlace puede haber expirado o ser inválido.');
      } else {
        setSuccessMessage('¡Contraseña restablecida exitosamente! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
          // Redirige a la raíz de la aplicación de forma nativa
          window.location.href = '/'; 
        }, 2000);
      }
    });
  };

  // Mostrar un mensaje si no hay token válido (early return)
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Token invalid</h2>
          <p className="text-gray-700 mb-4">
            El enlace de restablecimiento de contraseña es inválido o ha expirado.
          </p>
          <button
            onClick={() => window.location.href = '/'} // Redirige a la raíz de forma nativa
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  //Renderizado Principal del Formulario (JSX)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
              Confirm new Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"//Dispara el botoN onSubmit
            disabled={isSubmitting}//si isSubmitting es true el boton se desactiva evitando multiples envios
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/**Renderizado condicional Si isSubmitting es true, el texto es "Restableciendo..."; de lo contrario, es "Reset Password". */}
            {isSubmitting ? 'Restableciendo...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
