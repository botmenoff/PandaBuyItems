const User = require('../models/user.model');
const userService = require('../services/user.services')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config(); // Cargar las variables de entorno

// GETALL
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REGISTER
const register = async (req, res) => {
    try {
        // Verificar que el usuario y el email no estan ya registrados
        const user = req.body;

        // Username
        const existingUser = await User.findOne({ userName: user.userName });
        if (existingUser) {
            res.status(400).json({ Error: "This userName has allready been registred" });
        }

        // Email
        const existingEmail = await User.findOne({ email: user.email });
        if (existingUser) {
            res.status(400).json({ Error: "This email has allready been registred" });
        }

        // Hashear password
        const hashedPassword = await userService.hashString(user.password)
        // Insertar usuario
        const insertedUser = await User.create({ userName: user.userName, email: user.email, avatar: "https://ui-avatars.com/api/?name=" + user.userName + "&background=0D8ABC&color=fff&size=128", password: hashedPassword, isBanned: false, verifiedEmail: false, isAdmin: false })

        // Enviar email de verificacion
        // sendVerificationEmail(user)

        // Respuesta
        res.status(201).json({
            user: {
                userName: user.userName,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// LOGIN
const login = async (req, res) => {
    try {
        const credentials = req.body

        // Search user 
        const userFound = await User.findOne({ email: credentials.email })
        if (!userFound) {
            res.status(500).json({ message: "User not found" });
        }

        // Verificar contraseña
        const validPAssword = await bcrypt.compare(credentials.password, userFound.password)
        if (!validPAssword) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        // Generar el jwt
        const token = await jwt.sign({ id: userFound.id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 })
        res.status(200).json({ message: token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// EMAILS

// SENDEMAIL
const sendVerificationEmail = async (user) => {
    try {
        // Endpoint URL
        const endpointUrl = 'http://127.0.0.1:3000/api/user/verify/';

        // Payload
        const tokenPayload = {
            email: user.email
        }
        // Generar un json web token
        const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '24h' })
        // Generar la ruta a la que tiene que llegar con el token
        const verificationUrl = `${endpointUrl}${token}`;

        // Enviar email
        // Import the transporter object
        const { transporter } = require('../services/user.services.js');
        async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: 'Suppot team',
                to: user.email,
                subject: "Verification Email",
                html: `
            <p>Clica el boton para verificar tu cuenta </p>
            <a href="${verificationUrl}" target="_blank">
                <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
                    Verifica tu Email
                </button>
            </a>
        `,
            });

            console.log("Message sent: %s", info.messageId);
        }

        await main();
    } catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ 'Unexpected Error:': error.message });
    }
}

// EMAIL ENDPOINT
const verifyEmail = async (req, res) => {
    try {
        const token = req.params.jwt
        console.log(jwt);

        // Verificar el token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                res.status(500).json({ message: "Error decodifying" })
            } else {
                // Hacer una query para obtener el usuario
                const userEmail = decoded.email
                console.log(userEmail);
                // Buscar el usuario
                const user = await User.findOne({ email: userEmail });
                // Si no lo encuentra
                if (!user) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                } else {
                    // Hacer la consulta
                    const updatedUser = await User.updateOne({ verifiedEmail: true });
                }
                res.status(200).json({ message: "Email verificado exitosamente" });
            }
        })

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}

// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('userName email avatar isBanned verifiedEmail isAdmin createdAt updatedAt');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json({ user: user });
        }
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}      

// UPDATE USER 
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Buscar el usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Preparar el userInput
        const userInput = {};

        // Si el campo de userName está relleno, le añadimos el campo correspondiente y generamos el avatar
        if (req.body.userName) {
            userInput.userName = req.body.userName;
            userInput.avatar = "https://ui-avatars.com/api/?name=" + req.body.userName + "&background=0D8ABC&color=fff&size=128";
        }

        // Si el campo de email está relleno, le añadimos el campo correspondiente
        if (req.body.email) {
            userInput.email = req.body.email;
        }

        // Comprobamos que haya campos para hacer el update
        if (Object.keys(userInput).length > 0) {
            try {
                const updatedUser = await User.findByIdAndUpdate(userId, userInput, { new: true });
                return res.status(200).json({ message: "User updated successfully", user: updatedUser });
            } catch (error) {
                return res.status(500).json({ message: "Error updating user", error: error.message });
            }
        } else {
            return res.status(400).json({ message: "No fields provided for update" });
        }
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}

// DELETE BY ID
const deleteUsersById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Uer not found" });
        }
        await user.deleteOne();
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = {
    getAllUsers,
    register,
    verifyEmail,
    login,
    getUserById,
    updateUser,
    deleteUsersById
};
