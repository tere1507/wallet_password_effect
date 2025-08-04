import React, { use, useState } from "react";
import { Meteor } from 'meteor/meteor'

export const ContactForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsAdding(true)

        if(!name || !email) {
            setError('Name and Email are required')
            setIsAdding(false)
            return
        }

        try {

           await Meteor.callAsync('contacts.insert', name, email, photoUrl)
            
            setSuccess('The contact has been added succcessfully')
            setName('')
            setEmail('')
            setPhotoUrl('')

            setTimeout(() => { //hide mgs afther two seconds
              setSuccess('')
            }, 2000)

            setIsAdding(false)
            setTimeout(() => setSuccess(''), 2000) //hide the success mgs
            
        } catch (err) {
          console.error('Error when adding contact', err)
          setError(err.reason || err.message || 'Error when adding contact')

        }finally {//sea exitosa o de error siempre se volvera a restablecer el estado de inicio
          setIsAdding(false)
        }
        
        
    }

    //JSX
    return (
    <div className="bg-emerald-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner mb-6">
      <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-200 mb-3">Add new Contact</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
          <input
            type="text"
            id="contactName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            id="contactEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="contactPhoto" className="block text-sm font-medium text-gray-700 dark:text-gray-200">URL de la Foto (Opcional)</label>
          <input
            type="url"
            id="contactPhoto"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
}