import React, { useState } from "react";
import { Meteor } from 'meteor/meteor'

export const AddMoneyModal = ( { onClose }) => {
    const [amount, setAmount ] = useState('')
    const [ error, setError ] = useState('')
    const [ success, setSuccess ] = useState('')
    const [ isAdding, setIsAdding ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setSuccess('')
        setIsAdding(true)

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please , enter a valid and positive amount')
            setIsAdding(false)
            return
        }
        
        try {

          // Usamos await en la primera llamada al método del servidor
          await Meteor.callAsync('wallets.addMoney', numAmount)//llama a un metodo del servidor wallets.addMoneyy le pasa numAmount-> cantidad dinero a agregar
            
          // Si la primera llamada es exitosa, hacemos la segunda
          const txId = await Meteor.callAsync('transactions.record', 'add', numAmount)
          setSuccess(`Money added with success ID: ${txId || 'N/A'}`)
          setAmount('')

          // Espera a que el usuario vea el mensaje de éxito antes de cerrar el modal.
          setTimeout(onClose, 1500)

        }catch (err) {
          console.error('Error in AddMoneyModal: ' , err)
          setError(err.reason || 'Error Adding money')

        }finally {
          //este bloque se ejecuta siempre tanto como si hay exito como si hay error
          setIsAdding(false)
        }
        }
        
        //our JSX this will be renderizer
    return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mb-4">Add Money</h2>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

    
