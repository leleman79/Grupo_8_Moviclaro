//Guardar al usuario en la db
//buscar al usuario que se quiere loguear por su email
//buscar a un usuario por su id
// Editar la informacion de un usuario
// Eliminar a un usuario de la db
const path = require('path')

const fs = require('fs');

const User = {

    fileName: path.join(__dirname, '../data/users.json'),

    getData: function() {
        return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
    },

    findAll: function() {
        return this.getData()
    },

    generateId: function() {
        let allUsers = this.findAll()
        let lastUser = allUsers.pop();
        if (lastUser) {
            return lastUser.id + 1;
        } else {
            return 1;
        };
    },

    findByPk: function(id) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser.id === id);
        return userFound;
    },

    findByField: function(field, text) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser[field] === text);
        return userFound;
    },


    create: function(userData) {
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateId(),
            ...userData
        }
        allUsers.push(newUser);
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, ' '));
        return newUser;
    },
    delete: function(id) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
        fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));
        return true;
    }

}
module.exports = User;