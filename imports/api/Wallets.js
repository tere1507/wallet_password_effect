import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check'

export const Wallets = new Mongo.Collection('wallets');

if(Meteor.isServer) {//verifica si esta dentro del servidor
    Meteor.publish('myWallet', async function() {
        if(!this.userId) {
            return this.ready()
        }
        return Wallets.find({ userId: this.userId })
    });

    Meteor.methods({
        'wallets.addMoney': async function(amount) {
            // Validación de seguridad: siempre primero
            if(!this.userId) {
                throw new Meteor.Error("not-authorized", 'User is not logged in');
                
            }

            check( amount, Number)
            if ( amount <= 0) {
                throw new Meteor.Error("invalid-amount", 'Amount must be a positive number.');
                
            }

            // Usamos await con upsertAsync
            // Upsert: Si el wallet existe, actualiza; si no, lo crea.
            await Wallets.upsertAsync(
                { userId: this.userId },
                { $inc: { balance: amount }, $set: { userId: this.userId} }
            )
        },

        'wallets.transferMoney': async function (amount, toContactId) {
            // Validación de seguridad
            if(!this.userId) {
                throw new Meteor.Error("not-authorized", 'User is not logged in');

            
            check(amount, Number)
            check(toContactId, String)   
            }
            if(amount <= 0) {
                throw new Meteor.Error("invalid-amount", 'Amount must be a positive number');
                
            }
            // Lógica de transferencia (se vería en el frontend y en un método de contacto si existiera)
            // Por simplicidad, aquí solo reducimos el balance del que envía.
            // En un sistema real, se debería sumar al destinatario y manejar atomically
            const wallet = await Wallets.findOneAsync({ userId: this.userId })
            if(!wallet || wallet.balance < amount){
                throw new Meteor.Error("insufficient-funds", 'Insufficient funds');
                
            }
            await Wallets.updateAsync(
                { userId: this.userId },
                { $inc: {balance: -amount}}
            )
            // Aquí se podría añadir lógica para el balance del receptor (si es un usuario de la app)
            // O solo registrar la transacción.
            // NOTA: Aquí se podría implementar la lógica para encontrar el wallet del
            // contacto y sumarle el dinero, también con updateAsync.
            // Pero dejaremos la lógica original para no introducir cambios no solicitados.
        }
    })
}
