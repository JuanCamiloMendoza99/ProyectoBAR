const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


/* Registro Usuario */
router.get('/adminusuariosAdmin', isLoggedIn, async (req, res) => {
    try {
        if (req.user.USU_ROL == "Administrador") {
            const users = await pool.query('SELECT * FROM users');
            res.render('crud/adminusuarios', {users});
         }  else {
            res.redirect('/redirect');
        } 
    } catch (error) {
        res.render('401');
    }
});

/* Registro Usuario */
router.get('/adminusuarios', isLoggedIn, async (req, res) => {
    try {
        if (req.user.USU_ROL == "Administrador" || req.user.USU_ROL == "Supervisor") {
            const users = await pool.query('SELECT * FROM users');
            res.render('reportingSupervisor/adminusuarios', {users});
         }  else {
            res.redirect('/redirect');
        } 
    } catch (error) {
        res.render('401');
    }
});

router.post('/adminusuarios', async (req, res) => {
    const { documento, nombres_apellidos, logincms, usuario, rol, area_gestion, aliado, estado_usuario, cargo, responsable_gestion} = req.body;
    console.log(req.body);
    const newUser = {        
        USU_DOCUMENTO: documento,
        USU_NOMBRES_APELLIDOS: nombres_apellidos,     
        USU_LOGINCMS: logincms,
        USU_USUARIO: usuario,
        USU_ROL: rol,
        USU_ROL: area_gestion,
        USU_ALIADO: aliado,
        USU_ESTADO: estado_usuario,
        USU_CARGO: cargo,
        USU_RESPONSABLE_GESTION: responsable_gestion
    };
    console.log(newUser);
    await pool.query('INSERT INTO users set ?', [newUser]);
    req.flash('success', 'Usuario Registrado Correctamente!!!');
    res.redirect('/adminusuarios');
})


/* Modificar Usuario */
router.post('/adminusuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { documento, nombres_apellidos, logincms, usuario, rol, area_gestion, aliado, estado_usuario} = req.body;
    console.log(req.body);
    const cargo = req.user.USU_ROL;
    const responsable_gestion = req.user.USU_NOMBRES_APELLIDOS;
    const newUser = {        
        USU_DOCUMENTO: documento,
        USU_NOMBRES_APELLIDOS: nombres_apellidos,
        USU_LOGINCMS: logincms,
        USU_USUARIO: usuario,
        USU_ROL: rol,
        USU_ROL: area_gestion,
        USU_ALIADO: aliado,
        USU_ESTADO: estado_usuario,
        USU_CARGO: cargo,
        USU_RESPONSABLE_GESTION: responsable_gestion
    };
    await pool.query('UPDATE users set ? WHERE USU_PK_ID = ?', [newUser,[id]]);
    req.flash('success', 'Usuario Actualizado Correctamente!!!');
    res.redirect('/adminusuarios');
});

module.exports = router;