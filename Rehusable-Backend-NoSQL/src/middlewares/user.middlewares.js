const Joi = require('joi');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken')

const registerMiddleware = (req, res, next) => {
    try {
        const userSchema = Joi.object({
            userName: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                /*
                    - La contraseña debe contener al menos una letra mayúscula.
                    - La contraseña debe contener al menos un dígito.
                    - La contraseña debe contener al menos uno de los caracteres especiales: !@#\$%\^&\*.
                    - La longitud total de la contraseña debe ser al menos 8 caracteres.
                */
                .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
                .required(),
            passwordConf: Joi.ref('password')
        });

        // Definimos el error
        const user = req.body;
        const { error } = userSchema.validate(user);

        if (error) {
            // Create a custom response for each validation error
            const customErrors = error.details.map(detail => {
                let customMessage = 'Error en el campo ' + detail.context.label;
                switch (detail.context.key) {
                    case 'email':
                        customMessage = 'Error: Email field is incorrect';
                        break;
                    case 'password':
                        customMessage = 'Error: Password field is incorrect remember it has to have 1 mayus 1 number, 1 special character and 8 digits';
                        break;
                    case 'userName':
                        customMessage = 'Error: Username has to have minimum 3  characters and maximum 30 and no strange characters';
                        break;

                    case 'passwordConf':
                        customMessage = 'Error: It has to match the password';
                        break;
                    // Add cases for other fields
                    default:
                        customMessage = 'Error en el campo ' + detail.context.label;
                }
                return {
                    message: customMessage,
                    path: detail.path,
                };
            });

            res.status(400).json({ 'Bad request': customErrors });
        } else {
            next();
        }

    } catch (error) {
        res.status(500).json({ 'Revise your user': error.details });
    }
};


// VERIFY THAT THE TOKEN BELONGS TO THE USER
const verifyOwner = async (req, res, next) => {
    try {
        // Obtener el token
        const authorizationHeader = req.headers['authorization'];
        const paramId = req.params.id;
        // Si no ha puesto el parametro
        if (authorizationHeader === undefined) {
            res.status(400).json({ message: "Authorization header is required" });
        } else {
            // Verificar el token
            jwt.verify(authorizationHeader, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    await console.log(err);
                    
                    res.status(500).json({ message: "Error decodifying verify the token" })
                } else {
                    // Hacer una query para obtener el usuario
                    const userId = decoded.id
                    // Buscar el usuario
                    const userFounded = await User.findById(userId);
                    // console.log(userFounded);
                    // Si es admin puede pasar
                    if (userFounded.isAdmin) {
                        next()
                    } else {
                        // Si el id es el mismo
                        if (userId == paramId) {
                            next()
                        } else {
                            return res.status(401).json({ message: "You are not the owner of this user" });
                        }
                    }
                }
            })
        }

    } catch (error) {
        await console.log(error);
        
        res.status(500).json({ 'Unexpected Error:': error });
    }
}


module.exports = {
    registerMiddleware,
    verifyOwner
}