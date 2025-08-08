import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import './main.css';
import { App } from '/imports/ui/App';
import '../imports/api/Wallets' // Para que las colecciones estén disponibles en el cliente
import '../imports/api/Contacts'
import '../imports/api/Transactions'

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(<App />);
})
