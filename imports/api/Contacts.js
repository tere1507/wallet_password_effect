import { Mongo } from 'meteor/mongo'
import { Meteor  } from 'meteor/meteor'
import { check } from 'meteor/check'

export const Contacts = new Mongo.Collection('contacts')

if(Meteor.isServer) { //Comprueba si el código se está ejecutando en el servidor (no en el cliente).
    //Las publicaciones (Meteor.publish) solo deben ejecutarse en el servidor, ya que es quien tiene acceso completo a la base de datos.
    Meteor.publish('myContacts', async function() {
        if(!this.userId) { //verifica si no hay un usuario conectado null o undefined
            return this.ready()//Si no hay usuario, devuelve this.ready() para terminar la publicación sin enviar datos.
        }
        //si hay un usuario conectado muestra todos los contactos del propio usuario
        return Contacts.find({ userId: this.userId })
    })

    Meteor.methods({
        'contacts.insert': async function (name, email, photoUrl) {
            check(name, String);
            check(email, String);
            check(photoUrl, String)

            if(!this.userId) {
                throw new Meteor.Error("not-authorized", 'User is not logged in');
                
            }

            // Validar si el email ya existe para este usuario
            const existingContact = await Contacts.findOneAsync( { userId: this.userId, email:email})
            if(existingContact) {
                throw new Meteor.Error("contact-exists", 'A contact with this email alredy exists.');
                
            }

            await Contacts.insertAsync({
                userId: this.userId,
                name, 
                email,
                photoUrl,
                createAt: new Date()
            })
        },
        'contacts.remove': async function(contactId) {
            check(contactId, String)

            if(!this.userId) {
                throw new Meteor.Error("not-authorized", 'User is not logged in');
                
            }

            //get the contact
            const contact = await Contacts.findOneAsync(contactId)

            if(!contact) {
                throw new Meteor.Error("contact-not-found", 'Contact not found');
                
            }

            if(contact.userId !== this.userId) {
                throw new Meteor.Error("not-authorized", 'You are not authorized to remove this contact');
                
            }
            
            await Contacts.removeAsync(contactId)
        }
    })
}