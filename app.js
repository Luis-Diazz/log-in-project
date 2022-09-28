const express=require("express");
const mongoose=require("mongoose");
const path=require('path');

const app=express();
//app.set("port", 3000);
//app.set("port", process.env.PORT || 3000);
const port =  process.env.PORT || 3000;

// app.listen(app.get("port"), ()=> {
//     console.log(`Server online at ${app.get("port")}`);
// });

app.listen(port, ()=> {
    console.log(`Server online at ${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));
// const sign_in=app.use(require('./public/sign-in-user.js'));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// MONGOOSE PART
const DB_URI="mongodb://localhost:27017/log_in_database"
const config={
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(DB_URI, config, function (e){
    if (e) {
        console.log("------ERROR WITH DATABASE------");
    } else {
        console.log("------DATABASE CONNECTED------");
    };
});
const userSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            // unique:true
        },
        password: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
var userModel=new mongoose.model('userCollection',userSchema);

// REGISTER PART
async function verifyMail (e){
    const query=await userModel.findOne({email:`${e}`});
    return query;
};

async function createUser (info) {
    let fn=info.first_name.trim();
    let ln=info.last_name.trim();
    let e=info.email.trim();
    let p=info.password.trim();
    let pc=info.confirm_password.trim();
    let answer= await verifyMail(e);
    console.log(answer);
    if (p!=pc) {
        return 'contraseña no coincide';
    };
    if (answer == null) {
        userModel.create({
            name: `${fn} ${ln}`,
            email: `${e}`,
            password: `${p}`
        });    
        return 'usuario creado';
    } else {
        return 'usuario existente';
    };
};

app.post('/register', async(req, res, next)=> {
    let answer=await createUser(req.body);
    if (answer=='usuario existente') {
        console.log('Correo ya existe');
        res.redirect('/already-reg-error.html');
    } else if (answer=='usuario creado') {
        console.log('Usuario creado');
        res.redirect('/index.html');
    } else {
        console.log('Contraseña repetida mal');
        res.redirect('/repeat-error.html');
    };
});

// SIGN-IN PART
async function verifyPassword (p){
    const query=await userModel.findOne({password:`${p}`});
    return query;
};
async function checkUser(info) {
    let email=info.email.trim();
    let password=info.password.trim();
    let emailCheck=await verifyMail(email);
    let passwordCheck=await verifyPassword(password);
    console.log(emailCheck);
    console.log(passwordCheck);
    try {
        if (email==emailCheck.email) {
            if (password==passwordCheck.password) {
                return 'usuario registrado';
            } else {
                return 'usuario no registrado';
            };
        } else {
            return 'usuario no registrado';
        };
    } catch (error) {
        return 'usuario no registrado';
    };
    // if (email==emailCheck.email) {
    //     if (password==passwordCheck.password) {
    //         return 'usuario registrado';
    //     } else {
    //         return 'usuario no registrado';
    //     };
    // } else {
    //     return 'usuario no registrado';
    // };
    // if (emailCheck == true) {
    //     console.log('no nulo');
    //     let realPassword=emailCheck.password;
    //     if (password==realPassword) {
    //         return 'usuario registrado';
    //     } else {
    //         return 'usuario no registrado';
    //     };
    // } else {
    //     return 'usuario no registrado';
    // };
};
app.post('/sign-in', async (req, res, next)=> {
    let answer= await checkUser(req.body);
    module.exports = answer;
    if (answer=='usuario registrado') {
        console.log('Ingreso exitoso');
        res.send('Ingreso exitoso');
    } else {
        res.redirect('/data-error.html');
    };
});