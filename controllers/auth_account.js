const encrypt = require('bcrypt');
const mysql = require('mysql2');
const JWT = require('jsonwebtoken');
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DATABASE_PORT
    }
);

exports.addAccount = (req,res)=>{

    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let cpassword = req.body.cPassword


    db.query("SELECT email FROM user WHERE email = ?", email,
    async (error,result)=>{
        if (error){
            console.log("Error: "+ error);
        }
        else{
            if (result.length >0)
                {
                    console.log(result);
                    return res.render('register',{message: "Email Already Exist"});
                }
            else{
            
               if(password !== cpassword){
                console.log(password + cpassword);
                return res.render('register',{message: "Password Didnt Match"});
               }
               else{
                    const hashPassword = await encrypt.hash(password, 8);
                    console.log(hashPassword)
                    db.query("INSERT INTO user (username,email,password) VALUES (?, ?, ?)",
                    [username,email,hashPassword],
                    // db.query("INSERT INTO accounts set ", [{first_name: firstName,last_name: lastName, email:email,password}],
                    (error, result)=>{
                        if(error){
                            return console.log("Error:" +error);
                        }
                        else{
                            console.log(result);
                            return res.render('register',{message: "User Account has been Added"});
                        }
                    }
                )
                
                     console.log(password + cpassword);
                
               }
                
            }
        }
    })
}

exports.studentAccount = (req,res)=>{

    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let course_id = req.body.course_id


    db.query("SELECT email FROM students WHERE email = ?", email,
    async (error,result)=>{
        if (error){
            console.log("Error: " + error);
        }
        else{
            if (result.length >0)
                {
                    console.log(result);
                    return res.render('student',{message: " Already Exist"});
                }
            else{
                db.query("INSERT INTO students (first_name,last_name,email,course_id) VALUES (?, ?, ?, ?)",
                [first_name,last_name,email,course_id],
                (error, result)=>{
                    if(error){
                        return console.log("Error:" + error);
                    }
                    else{
                        console.log(result);
                        return res.render('student',{message: "User Student has been Added"});
                    }
                })

            }
        }
    })
}


exports.loginAccount =async (req,res)=>{
    try {
        const { email , password} = req.body;
        console.log(email+password);
        if (email== "" || password==""){
            res.render('index',{message: "Please Completed Fields"});
        }
        else{
            db.query("SELECT * FROM user WHERE email = ?", email,
            async (error,result)=>{
                console.log(result);
                
                if(!result){
                    res.render('index',{message: "Email is Incorrect"});
                }
                else if(!(await encrypt.compare(password, result[0].password)))
                {
                    res.render('index',{message: "Password is Incorrect"});
                }
                else{
                    db.query('SELECT * FROM students', (error, result)=>
                    {
                        console.log(result)
                        if(error){
                            console.log(`Error Message : ${error}`)
                              }
                        else if (!result){
                             res.render(`student`, {message: "No result found!"})
                          }
                           else{
                              res.render('student', 
                               {
                                title: "List of Students",
                                data: result
                                 })
                             }
                          })
                    // response.render('index',{message: "Login Successfully"}); 
                    console.log("Login Successfully")
                     
                    
                }

            })
        }
       
    } catch (error) {
        console.log("Error:" + error);
    }
}


exports.updateAccount = (req, res) => {
    try {
        const student_id = req.params.student_id;
        console.log(student_id)
        db.query('SELECT * FROM students where student_id = ?', student_id,
        (error, result) => {
            if (error) {
                console.log('Error in Login: ' + error)
            }
            else {
                return res.render('updateaccount', {title: "Update User Information", data: result[0]})
            }
        }
        )
    }
    catch (error) {
        console.log(`Error in Update: ${error}`)
    }
}

exports.updateStudent =(request,response)=>{
    const student_id = request.params.student_id;
    console.log(student_id);

    db.query("SELECT * FROM students WHERE student_id = ?", student_id,
    (error,data) =>{
        if(error){
            console.log(error)
        }
        else{
            response.render('home',{
                message: 'Successfully Updated',
                // title: 'Update Student Account ',
                data: data[0]
            })
        }
    }
    )
}

exports.updateUser = (req, res) => {

    const { student_id, first_name, last_name } = req.body

    db.query('UPDATE students SET first_name = ?, last_name = ? WHERE student_id = ?', [first_name, last_name, student_id],
    (error, data) => {
        if (error) {
            console.log('Error in Update: ' + error)
        }

        else {
            db.query('SELECT * FROM students', 
            (error, result) => {
                if (error) {
                    console.log('Error' +error)
                }
                else if (!result){
                    return res.render('viewstudents', { message: 'There is no result'})
                }
                else {
                    return res.render('viewstudents', {message: `The account has been updated with account ID of ${student_id}`, title: "List of Users", data: result})
                }
            })
        }
    })
}


exports.deleteAccount = (req, res) => {
    const student_id = request.params.student_id

    db.query('DELETE FROM students WHERE student_id = ?', [student_id],
    (error, data) => {
        if (error) {
            console.log('Error in Delete: ' + error)
        }

        else {
            db.query('SELECT * FROM students', 
            (error, result) => {
                if (error) {
                    console.log('Error' +error)
                }
                else if (!result){
                    return res.render('viewstudents', { message: 'There is no result'})
                }
                else {
                    return res.render('viewstudents', {message: `The account has been deleted with student ID of ${student_id}`, title: "List of Users", data: result})
                }
            })
        }
    })
}

exports.logoutAccount = (req,res) =>{
    console.log(req.session);

    res.clearCookie("cookie_access_token").status(200);
    res.render("index");
}