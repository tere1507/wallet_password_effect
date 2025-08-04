import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Transactions  = new Mongo.Collection('transactions')

if(Meteor.isServer) {//comprueba si estamos en el servidor
    //las publicaciones siempre deben estar en el servidor pro qeu son las que tiene las bases de datos
    Meteor.publish('myTransactions',async function() {
        if(!this.userId) {
            return this.ready()
        }
        return Transactions.find({ userId: this.userId}, { sort: {createdAt: -1}, limit: 100})
    });

    Meteor.methods({
        'transactions.record': async function (type, amount, toContactId=null) {
            check(type, String)
            check(amount, Number)
            //toContactId can be null or string
            if(toContactId !== null) check(toContactId, String)

            if(!this.userId) {
                throw new Meteor.Error("not-authorized", 'User is not logged in');
                
            }

            if(amount <= 0) {
                throw new Meteor.Error("Invalid-amount", 'The amount must be a valid and positive number');
                
            }

            //generar un ID unico para la transaction
            const uniqueId = new Mongo.ObjectID().toHexString() // O usar un paquete como 'uuid'

            await Transactions.insertAsync({
                userId: this.userId,
                type, //'add' o 'transfer
                amount, 
                toContactId, //only if is a transfer
                uniqueId, //the new ID to this movement
                createdAt: new Date()
            })

            return uniqueId; // return the ID generate
        }
    })
}