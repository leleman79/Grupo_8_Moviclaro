const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')

const usersFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

const User = require('../models/User')
let db = require("../database/models");


const userController = {
    registro: (req, res) => {
        const countries = db.Country.findAll()
         .then(function(countries){ 
             console.log(countries)
            res.render(path.join(__dirname, '../views/users/register'), {countries})

         })
       

/* 
        let color = db.Color.findAll()
        let category = db.ProductCategory.findAll()
        let brands = db.Brand.findAll()

        Promise.all([color, category, brands])
            .then(function([color, category, brands]){
                res.render('products/productCreate',{color:color, category:category, brands:brands})
            }) */
    },
    
    storeUser: (req, res) => {
        const resultsValidation = validationResult(req);

        if (resultsValidation.errors.length > 0) {
            return res.render(path.join(__dirname, '../views/users/register'), {
                errors: resultsValidation.mapped(),
                oldData: req.body

            });
        }

        let userInDb = User.findByField('email', req.body.email);
        if (userInDb) {
            return res.render(path.join(__dirname, '../views/users/register'), {
                errors: {
                    email: {
                        msg: 'Este email ya está registrado'
                    }
                },
                oldData: req.body
            });
        }

        if (req.body.password !== req.body.password2) {
            return res.render(path.join(__dirname, '../views/users/register'), {
                errors: {
                    password2: {
                        msg: 'Las contraseñas no coinciden'
                    }
                },
                oldData: req.body
            });
        }
        /*esto es lo nuevo*/
        db.User.create({

            include:[ "countries"],
            name:req.body.name,
            last_name: req.body.name,
            category_id: 1,
            image: req.file.filename,
            country_id: req.body.countries,
            password: bcryptjs.hashSync(req.body.password, 10),
            email: req.body.email,
            phone: req.body.phone 

        })
        return res.render(path.join(__dirname, '../views/users/login'))
    },
    login: (req, res) => {

        res.render(path.join(__dirname, '../views/users/login'))
    },
    processLogin: (req, res) => {
        let userToLogin;
        let userAdmin;
          
         db.User.findOne({
            include: ['countries'],
             where: {
             email: req.body.email
             }
             }).then((resultado)=> {
                  userToLogin = resultado;
                  if (userToLogin.email ) {
                     userAdmin = userToLogin.category_id;
                     let passwordOk = bcryptjs.compareSync(req.body.password, userToLogin.password);
                     if (passwordOk) {
                         delete userToLogin.password
                         delete userToLogin.password2
                         req.session.userLogged = userToLogin;
         
                         if (req.body.recordame) {
                             res.cookie('userEmail', req.body.email, { maxAge: 1000 * 300 });
         
                         }
         
                         return res.redirect('/user');
         
                     }
                     return res.render((path.join(__dirname, '../views/users/login')), {
                         errors: {
                             email: {
                                 msg: 'Las credenciales son inválidas'
                             }
                         }
                     });
                 }
                 return res.render((path.join(__dirname, '../views/users/login')), {
                     errors: {
                         email: {
                             msg: 'No se encuentra este mail'
                         }
                     }
                 });
                 
         })
         
           //  let userToLogin = User.findByField('email', req.body.email);
          //   console.log("se guardo el mail del json" +userToLogin)
         //    let userAdmin = User.findByField('category_id', '2');
            // console.log("se guardo el userAdmin: "+ userAdmin)
     
     
    },
    user: (req, res) => {

        return res.render(path.join(__dirname, "../views/users/userPerfil"), {
            user: req.session.userLogged
        })
    },

    logout: (req, res) => {

            res.clearCookie('userEmail')
            req.session.destroy();

            res.redirect('/');
        },
        // user: (req, res) => {
        //     const requestedId = req.params.id;
        //     const usuario =
        //         users.find((user) => user.id == requestedId) || users[0];
        //     let pathUser = path.join(__dirname, "../views/users/userPerfil");
        //     res.render(pathUser, { usuario })
    
    

//eliminar un usuario
    destroy: (req,res) => {
        const userId = req.params.id;
        db.User.destroy({
            where:{ id: userId}
        })
        res.redirect('/');
    },
//abrir pagina de edición de usuario
    edit: (req,res) =>{
        db.User.findOne({
            where: {id: req.params.id},
            include: ['countries']
            })
            .then((user)=> { 
                 let pathEdit = path.join(__dirname, '../views/users/userEdit');
                res.render(pathEdit, { user });
             })
     },
//guardar datos editados el usuario

     update: (req,res) =>{
         let userId = req.params.id
         db.User.findByPk(userId)
        .then((user)=>{
             db.User.update({
                name: user.name
            },
            {
                where: {id: userId}
            }) 
         
         res.send("el nombre es: " +user.name)}
        )}
       
        
     

    }





module.exports = userController;