import React, { useState } from "react";
import { Meteor } from 'meteor/meteor'

export const TransferMoneyModal = ({ contacts, onClose }) => {
    const [ amount, setAmount ] = useState('')
    const [ selectedContactId, setSelectedContactId ] = useState('')
    const [ error, setError ] = useState('')
    const [ success, setSuccess ] = useState('')
    const [ isTransferring , setIsTransferring ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsTransferring(true)

        const numAmount = parseFloat(amount)
        if(isNaN(numAmount) || numAmount <= 0) {
            setError('The Amount must be valid and positive')
            setIsTransferring(false)
            return;
        }
        if(!selectedContactId) {
            setError('Pleas, select a contact to transfer')
            setIsTransferring(false)
            return;
        }

        try {
          // Usamos await en la primera llamada al método del servidor
          await Meteor.callAsync('wallets.transferMoney', amount, selectedContactId)

          //Si la primera llamada es exitosa, hacemos la segunda
          const txId = await Meteor.callAsync('transactions.record', 'trasnfer', numAmount, selectedContactId)
          
          setSuccess(`Transaction successful with ID: ${txId || 'N/A'} `)
          setAmount('')
          setSelectedContactId('')

          // Espera a que el usuario vea el mensaje de éxito antes de cerrar el modal
          setTimeout(onClose, 1500)
      } catch(err) {
        console.error('Error in TransferMoneyModal', err)
        setError(err.reason || 'Error transferring money')
        
      }finally {
        //this bloq execute alweys , is success or is error
        setIsTransferring(false) //asegura que el el estado de carga setIsTransferring se desactive siempre
      }

        
    } 

    //JSX lo que se va aha ver o redirigin en el browser
    return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-200 mb-4">Transfer Money</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (€)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Contact</label>
            <select
              id="contact"
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            >
              <option value="">-- Select a contact --</option>
              {contacts.map(contact => (
                <option key={contact._id} value={contact._id}>
                    {contact.name} ({contact.email})</option>
              ))}
            </select>
            {contacts.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You do not have a contacts yet. Pleas isert one.</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
              disabled={isTransferring}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isTransferring}
            >
              {isTransferring ? 'Transfirring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}