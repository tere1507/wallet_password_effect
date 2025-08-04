// imports/ui/WalletLayout.jsx
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from 'meteor/react-meteor-data';
import { Header } from './Header';
import { Footer } from './Footer';
import { BalanceDisplay } from './BalanceDisplay';
import { AddMoneyModal } from './AddMoneyModal';
import { TransferMoneyModal } from './TransferMoneyModal';
import { ContactForm } from './ContactForm';
import { ContactList } from './ContactList';

// Importar colecciones
import { Transactions } from "../api/Transactions";
import { Wallets } from "../api/Wallets";
import { Contacts } from "../api/Contacts";

export const WalletLayout = ({ user }) => {
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [showTransferMoneyModal, setShowTransferMoneyModal] = useState(false);

    // Usar useTracker para manejar la reactividad de los datos
    const { wallet, contacts, transactions, isLoading } = useTracker(() => {
        const walletHandle = Meteor.subscribe('myWallet');
        const contactsHandle = Meteor.subscribe('myContacts');
        const transactionsHandle = Meteor.subscribe('myTransactions');
        
        if (!walletHandle.ready() || !contactsHandle.ready() || !transactionsHandle.ready()) {
            return {
                wallet: null,
                contacts: [],
                transactions: [],
                isLoading: true,
            };
        }

        const myWallet = Wallets.findOne({ userId: Meteor.userId() });
        const myContacts = Contacts.find({ userId: Meteor.userId() }, { sort: { name: 1 } }).fetch();
        const myTransactions = Transactions.find({ userId: Meteor.userId() }, { sort: { createdAt: -1 } }).fetch();

        return {
            wallet: myWallet,
            contacts: myContacts,
            transactions: myTransactions,
            isLoading: false,
        };
    });

    // ¡La corrección está aquí! Usamos Meteor.logout
    const handleLogout = () => {
        try {
            Meteor.logout();
        } catch (err) {
            console.error('Error at logout', err);
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-emerald-700 dark:text-emerald-300">Wallet Loading...</div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-emerald-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            <Header user={user} onLogout={handleLogout} />

            <main className="flex-grow container mx-auto p-4 md:flex md:space-x-8">
                <section className="md:w-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8 md:mb-0">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-4 dark:text-emerald-200">My Wallet</h2>
                    <BalanceDisplay balance={wallet?.balance || 0} />
                    <div className="mt-6 flex justify-around space-x-4">
                        <button
                            onClick={() => setShowAddMoneyModal(true)}
                            className="px-6 py-3 bg-emerald-700 text-white rounded-md shadow hover:bg-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Add Money
                        </button>
                        <button
                            onClick={() => setShowTransferMoneyModal(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Transfer Money
                        </button>
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-700 mt-8 mb-4 dark:text-emerald-200">Last Movements</h3>
                    {transactions.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">There are no movements registered.</p>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map(tx => (
                                <div key={tx._id} className={`p-3 rounded-md shadow-sm ${tx.type === 'add' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100'}`}>
                                    <p className="font-medium">{tx.type === 'add' ? 'Added' : `Transferred to ${contacts.find(c => c._id === tx.toContactId)?.name || 'Unknown Contact'}`}: {tx.amount.toFixed(2)}€</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {tx.uniqueId} - {tx.createdAt.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="md:w-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-4 dark:text-emerald-200">My Contacts</h2>
                    <ContactForm />
                    <ContactList contacts={contacts} />
                </section>
            </main>
            {showAddMoneyModal && (  
                <AddMoneyModal onClose={() => setShowAddMoneyModal(false)} />
            )}
            {showTransferMoneyModal && (
                <TransferMoneyModal
                    contacts={contacts}
                    onClose={() => setShowTransferMoneyModal(false)}
                />
            )}
            <Footer />
        </div>
    );
};
