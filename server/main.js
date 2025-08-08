// /server/main.js
import { Meteor } from 'meteor/meteor';
import { Wallets } from '../imports/api/Wallets';
import { Contacts } from '../imports/api/Contacts';
import { Transactions } from '../imports/api/Transactions';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

Meteor.startup(async () => {
  // Configuración de correo para restablecimiento de contraseña.
  // **¡IMPORTANTE!** Debes reemplazar el valor por tu servidor SMTP real.
  if (!process.env.MAIL_URL) {
    process.env.MAIL_URL = 'smtp://user:password@smtp.example.com:587/';
    console.warn('ADVERTENCIA: La variable de entorno MAIL_URL no está configurada. Usando un valor por defecto.');
  }

  // Define la URL a la que el usuario será dirigido para restablecer la contraseña.
  // Esta debe coincidir con la ruta de tu componente en el cliente.
  Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl(`reset-password/${token}`);
  };

  // Configuración de Google OAuth (si estás usando Google Login).
  // Reemplaza 'TU_GOOGLE_CLIENT_ID' y 'TU_GOOGLE_CLIENT_SECRET' con tus credenciales.
  await ServiceConfiguration.configurations.upsertAsync(
    { service: 'google' },
    {
      $set: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'TU_GOOGLE_CLIENT_ID',
        secret: process.env.GOOGLE_CLIENT_SECRET || 'TU_GOOGLE_CLIENT_SECRET',
        loginStyle: 'popup'
      }
    }
  );

  // **CÓDIGO AGREGADO**: Esta es la función clave que faltaba.
  // Se encarga de personalizar cómo se crea un nuevo usuario, asegurando
  // que los datos de correo y perfil se guarden correctamente.
  Accounts.onCreateUser((options, user) => {
    if (options.email) {
      user.emails = [{ address: options.email, verified: false }];
    }
    if (options.username) {
      user.username = options.username;
    }
    if (options.profile) {
      user.profile = options.profile;
    }
    if (user.services && user.services.google) {
      user.username = user.services.google.name;
      user.emails = [{ address: user.services.google.email, verified: true }];
    }
    return user;
  });

  // Publicar información básica del usuario para el cliente.
  Meteor.publish('currentUserData', function () {
    if (this.userId) {
      return Meteor.users.find(
        { _id: this.userId },
        { fields: { emails: 1, username: 1, profile: 1, services: { google: 1 } } }
      );
    }
    return this.ready();
  });

  // Publicar tus colecciones para que sean accesibles desde el cliente.
  Meteor.publish('wallets', function () {
    return Wallets.find();
  });

  Meteor.publish('contacts', function () {
    return Contacts.find();
  });

  Meteor.publish('transactions', function () {
    return Transactions.find();
  });

  // Configuración de las plantillas de correo para el restablecimiento de contraseña.
  Accounts.emailTemplates.siteName = 'My Wallet At';
  Accounts.emailTemplates.from = 'My Wallet AT Admin <admin@mywalletat.com>';

  Accounts.emailTemplates.resetPassword.subject = () => {
    return "Restablece tu contraseña de My Wallet AT";
  };

  Accounts.emailTemplates.resetPassword.text = (user, url) => {
    const userEmail = user.emails[0].address;
    return `Hola ${userEmail},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n\n${url}\n\nSi no solicitaste esto, ignora este correo.`;
  };

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
