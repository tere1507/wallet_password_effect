import React, { useState } from "react";
import { Meteor } from 'meteor/meteor'

export const ContactList = ( { contacts }) =>{

    const [confirmDeleteId, setConfirmDeleteId ] = useState(null)//usamos null al inicio porque no hay nada para eliminar la principio hasta que le usuario de click en el boton de eleminar 
    const [error, setError ] = useState('')
    const [success , setSuccess ] = useState('')
    const [isRemoving, setIsRemoving ] = useState(false)
    

  const handleRemoveContact = async (contactId) => {
    setIsRemoving(true)
    setError('')
    setSuccess('')

    try{
      await Meteor.callAsync('contacts.remove', contactId)
      setSuccess('Contact deleted successfully')
    }catch (err) {
      console.error('Error removing contact', err)
      setError(err.reason || err.message || 'Error when deleting contact')

    }finally{
      setIsRemoving(false)
      setConfirmDeleteId(null)
      //hide mgs afther a time
      setTimeout(() => {
        setError('')
        setSuccess('')
      }, 3000)
    }
  }

    if(!contacts || contacts.length === 0) {
        return <p className="text-gray-600 dark:text-gray-300 mt-4">You do not have any contacts yet, Pleas add one to start with the transfer</p>
    }

    //JSX
    return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-200 mb-3">Your Contacts</h3>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
      <ul className="space-y-4">
        {contacts.map(contact => (
          <li key={contact._id} className="flex items-center bg-gray-50 dark:bg-gray-600 p-3 rounded-md shadow-sm">
            {contact.photoUrl ? (
              <img
                src={contact.photoUrl}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-emerald-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-50 flex items-center justify-center font-bold text-xl mr-4 border-2 border-emerald-500">
                {contact.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-grow">
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{contact.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{contact.email}</p>
            </div>

            {/* Botón de eliminar que abre el modal de confirmación */}
            <button
              onClick={() => handleRemoveContact(contact._id)}
              className="ml-4 p-2 text-red-600 hover:text-red-800 transition-colors"
              title="Deleted Contact"
              disabled={isRemoving}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

     {/* Modal de confirmación para eliminar contacto */}
     {confirmDeleteId && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this contact?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRemoveContact(confirmDeleteId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isRemoving}
                            >
                                {isRemoving ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
     )} 
    </div>
  );
}