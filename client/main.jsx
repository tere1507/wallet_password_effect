import React from 'react';
//import { createRoot } from 'react-dom/client';
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor';
import './main.css';
import { App } from '/imports/ui/App';
import '../imports/api/Wallets' // Para que las colecciones estén disponibles en el cliente
import '../imports/api/Contacts'
import '../imports/api/Transactions'

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'))
});
