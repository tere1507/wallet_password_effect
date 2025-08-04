// /server/main.js
import { Meteor } from 'meteor/meteor';
import { Wallets } from '../imports/api/Wallets';
import { Contacts } from '../imports/api/Contacts';
import { Transactions } from '../imports/api/Transactions';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  if (!process.env.MAIL_URL) {
    process.env.MAIL_URL = 'smtp://user:password@smtp.example.com:587/';
    console.warn('WARNING: MAIL_URL was not set as an environment variable. Using a default value.');
  }

  // Define la URL para el restablecimiento de contraseña.
  Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl(`reset-password/${token}`);
  };

  // Configuración de plantillas de correo electrónico
  Accounts.emailTemplates.siteName = 'My Wallet At';
  Accounts.emailTemplates.from = 'My Wallet AT Admin <admin@mywalletat.com>';
  
  Accounts.emailTemplates.resetPassword.subject = () => {
    return "Restablece tu contraseña de My Wallet AT";
  };
  
  // Plantilla de texto plano (si el cliente de correo no soporta HTML)
  Accounts.emailTemplates.resetPassword.text = (user, url) => {
    const userEmail = user.emails[0].address;
    return `Hi ${userEmail},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n\n${url}\n\nSi no solicitaste esto, ignora este correo.`;
  };

  // Plantilla HTML (para mostrar el botón y un formato más bonito)
  Accounts.emailTemplates.resetPassword.html = (user, url) => {
    const userEmail = user.emails[0].address;
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hola ${userEmail},</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <p style="margin-top: 20px;">
          <a href="${url}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F46E5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          ">
            Restablecer mi contraseña
          </a>
        </p>
        <p style="margin-top: 20px;">Si no solicitaste esto, por favor ignora este correo.</p>
        <p>Gracias,</p>
        <p>El equipo de My Wallet AT</p>
      </div>
    `;
  };

});