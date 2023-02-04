const connectDB = require('../database/connection')
const FCM = require('fcm-node');
var fcmUser = new FCM(process.env.SERVER_KEY_USER)
var fcmProvider = new FCM(process.env.SERVER_KEY_PROVIDER)

module.exports = {
    countriesCodes : (req,res) => {
        connectDB.query('SELECT * FROM countrycode' , (err,codes) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var json = JSON.stringify(codes)
                    object = {
                        status : 200 ,
                        message : 'Success' ,
                        errors : [] ,
                        data : JSON.parse(json)
                    }
                res.send(object)
            }
        })
    },

    registerNewAccount : (req,res) => {
        if(req.body.accounttype == 'sitter') {
            connectDB.query('SELECT phonenumber FROM sitters WHERE phonenumber = ?' , [req.body.phonenumber] , (err,sitter) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else if(!sitter || sitter.length == 0) {
                    var user = {
                        username : req.body.username,
                        emailaddress : req.body.emailaddress,
                        phonenumber : req.body.phonenumber,
                        nationality : req.body.nationality,
                        city : req.body.city,
                        password : req.body.password
                    }
                    connectDB.query('INSERT INTO sitters SET ?' , [user] , (err,result) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'Successfully Registered' ,
                                errors : [] ,
                                data : {
                                    sitterid : result.insertId
                                }
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    var object = {
                        status : 400 ,
                        message : 'Phone Is Already Taken' ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
            })
        }
        else {
            connectDB.query('SELECT phonenumber FROM nurseries WHERE phonenumber = ?' , [req.body.phonenumber] , (err,nursery) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else if(!nursery || nursery.length == 0) {
                    var user = {
                        username : req.body.username,
                        emailaddress : req.body.emailaddress,
                        phonenumber : req.body.phonenumber,
                        nationality : req.body.nationality,
                        city : req.body.city,
                        password : req.body.password
                    }
                    connectDB.query('INSERT INTO nurseries SET ?' , [user] , (err,result) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'Successfully Registered' ,
                                errors : [] ,
                                data : {
                                    nurseryid : result.insertId
                                }
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    var object = {
                        status : 400 ,
                        message : 'Phone Is Already Taken' ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
            })
        }
    },
    
    updateToken : (req,res) => {
        let account = {
            id : req.body.id,
            accounttype : req.body.accounttype,
            token : req.body.token
        }
        if(account.accounttype == 'sitter') {
            connectDB.query('UPDATE sitters SET token = ? WHERE sitterid = ?' , [account.token,account.id] , (err,result) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var object = {
                        status : 200 ,
                        message : 'Token Updated' ,
                        errors : [] ,
                        data : {
                            sitterid : account.id
                        }
                    }
                    res.send(object)
                }
            })
        }
        else {
            connectDB.query('UPDATE nurseries SET token = ? WHERE nurseryid = ?' , [account.token,account.id] , (err,result) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var object = {
                        status : 200 ,
                        message : 'Token Updated' ,
                        errors : [] ,
                        data : {
                            nurseryid : account.id
                        }
                    }
                    res.send(object)
                }
            })
        }
    },

    addPapers : (req,res) => {
        if(req.body.accounttype == 'sitter') {
            if(!req.files['experiencecertificates']) {
                var papers = {
                    sitterid : req.body.sitterid,
                    lease : `server/uploads/${req.files['lease'][0].filename}`,
                    residencephoto : `server/uploads/${req.files['residencephoto'][0].filename}`,
                    personalpicture : `server/uploads/${req.files['personalpicture'][0].filename}`,
                    commercialrefister : `server/uploads/${req.files['commercialrefister'][0].filename}`,
                    taxnumber : `server/uploads/${req.files['taxnumber'][0].filename}`,
                    experiencecertificates : ''
                }
                connectDB.query('INSERT INTO sitterpapers SET ?' , [papers] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var personalpicture = `server/uploads/${req.files['personalpicture'][0].filename}`
                        connectDB.query('UPDATE sitters SET userimage = ? WHERE sitterid = ?' , [personalpicture,papers.sitterid] , (err,results) => {
                            if(err) {
                                var object = {
                                    status : 400 ,
                                    message : `${err}` ,
                                    errors : [] ,
                                    data : []
                                }
                                res.send(object)
                            }
                            else {
                                var object = {
                                    status : 200 ,
                                    message : 'Successfully Registered' ,
                                    errors : [] ,
                                    data : []
                                }
                                res.send(object)
                            }
                        })
                    }
                })
            }
            else {
                var experiencecertificates = []
                var cirtificates = req.files['experiencecertificates']
                for( var i = 0; i < cirtificates.length; i++){
                    experiencecertificates.push('server/uploads/'+ cirtificates[i].filename)
                }
                var papers = {
                    sitterid : req.body.sitterid,
                    lease : `server/uploads/${req.files['lease'][0].filename}`,
                    residencephoto : `server/uploads/${req.files['residencephoto'][0].filename}`,
                    personalpicture : `server/uploads/${req.files['personalpicture'][0].filename}`,
                    commercialrefister : `server/uploads/${req.files['commercialrefister'][0].filename}`,
                    taxnumber : `server/uploads/${req.files['taxnumber'][0].filename}`,
                    experiencecertificates : JSON.stringify(experiencecertificates)
                }
                connectDB.query('INSERT INTO sitterpapers SET ?' , [papers] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var personalpicture = `server/uploads/${req.files['personalpicture'][0].filename}`
                        connectDB.query('UPDATE sitters SET userimage = ? WHERE sitterid = ?' , [personalpicture,papers.sitterid] , (err,results) => {
                            if(err) {
                                var object = {
                                    status : 400 ,
                                    message : `${err}` ,
                                    errors : [] ,
                                    data : []
                                }
                                res.send(object)
                            }
                            else {
                                var object = {
                                    status : 200 ,
                                    message : 'Successfully Registered' ,
                                    errors : [] ,
                                    data : []
                                }
                                res.send(object)
                            }
                        })
                    }
                })
            }
        }
        else {
            if(!req.files['experiencecertificates']) {
                var papers = {
                    nurseryid : req.body.nurseryid,
                    lease : `server/uploads/${req.files['lease'][0].filename}`,
                    residencephoto : `server/uploads/${req.files['residencephoto'][0].filename}`,
                    personalpicture : `server/uploads/${req.files['personalpicture'][0].filename}`,
                    commercialrefister : `server/uploads/${req.files['commercialrefister'][0].filename}`,
                    taxnumber : `server/uploads/${req.files['taxnumber'][0].filename}`,
                    experiencecertificates : ''
                }
                connectDB.query('INSERT INTO nurserypapers SET ?' , [papers] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Successfully Registered' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
            else {
                var experiencecertificates = []
                var cirtificates = req.files['experiencecertificates']
                for( var i = 0; i < cirtificates.length; i++){
                    experiencecertificates.push('server/uploads/'+ cirtificates[i].filename)
                }
                var papers = {
                    nurseryid : req.body.nurseryid,
                    lease : `server/uploads/${req.files['lease'][0].filename}`,
                    residencephoto : `server/uploads/${req.files['residencephoto'][0].filename}`,
                    personalpicture : `server/uploads/${req.files['personalpicture'][0].filename}`,
                    commercialrefister : `server/uploads/${req.files['commercialrefister'][0].filename}`,
                    taxnumber : `server/uploads/${req.files['taxnumber'][0].filename}`,
                    experiencecertificates : JSON.stringify(experiencecertificates)
                }
                connectDB.query('INSERT INTO nurserypapers SET ?' , [papers] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Successfully Registered' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        }
    },

    loginAccount : (req,res) => {
        let account = {
            phonenumber : req.body.phonenumber,
            password : req.body.password
        }
        connectDB.query('SELECT sitterid,phonenumber,password,accounttype FROM sitters WHERE phonenumber = ?' , [account.phonenumber] , (err,sitter) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!sitter || sitter.length == 0) {
                connectDB.query('SELECT nurseryid,phonenumber,password,accounttype FROM nurseries WHERE phonenumber = ?' , [account.phonenumber] , (err,nursery) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!nursery || nursery.length == 0) {
                        var object = {
                            status : 400 ,
                            message : 'User Does Not Exist' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        if(nursery[0].password != account.password) {
                            var object = {
                                status : 400 ,
                                message : 'Password Is Not Correct' ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'Login Success' ,
                                errors : [] ,
                                data : {
                                    nurseryid : nursery[0].nurseryid,
                                    accounttype : nursery[0].accounttype
                                }
                            }
                            res.send(object)
                        }
                    }
                })
            }
            else {
                if(sitter[0].password != account.password) {
                    var object = {
                        status : 400 ,
                        message : 'Password Is Not Correct' ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var object = {
                        status : 200 ,
                        message : 'Login Success' ,
                        errors : [] ,
                        data : {
                            sitterid : sitter[0].sitterid,
                            accounttype : sitter[0].accounttype
                        }
                    }
                    res.send(object)
                }
            }
        })
    },

    getInfo : (req,res) => {
        var account = {
            accounttype : req.body.accounttype,
            accountid : req.body.accountid
        }
        if(account.accounttype == 'sitter') {
            connectDB.query('SELECT * FROM sitters WHERE sitterid = ?' , [account.accountid] , (err,sitter) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var json = JSON.stringify(sitter)
                        object = {
                            status : 200 ,
                            message : 'Success' ,
                            errors : [] ,
                            data : JSON.parse(json)
                        }
                    res.send(object)
                }
            })
        }
        else {
            connectDB.query('SELECT * FROM nurseries WHERE nurseryid = ?' , [account.accountid] , (err,nursery) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var json = JSON.stringify(nursery)
                        object = {
                            status : 200 ,
                            message : 'Success' ,
                            errors : [] ,
                            data : JSON.parse(json)
                        }
                    res.send(object)
                }
            })
        }
    },

    updateInfo : (req,res) => {
        if(req.body.accounttype == 'sitter') {
            if(!req.file) {
                var user = {
                    sitterid : req.body.sitterid,
                    username : req.body.username,
                    phonenumber : req.body.phonenumber,
                    emailaddress : req.body.emailaddress,
                    nationality : req.body.nationality,
                    brief : req.body.brief,
                    serviceprice : req.body.serviceprice,
                    gender : req.body.gender
                }
                connectDB.query('UPDATE sitters SET ? WHERE sitterid = ?' , [user,user.sitterid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Edited Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
            else {
                var user = {
                    sitterid : req.body.sitterid,
                    userimage : `server/uploads/${req.file.filename}`,
                    username : req.body.username,
                    phonenumber : req.body.phonenumber,
                    emailaddress : req.body.emailaddress,
                    nationality : req.body.nationality,
                    brief : req.body.brief,
                    serviceprice : req.body.serviceprice,
                    gender : req.body.gender
                }
                connectDB.query('UPDATE sitters SET ? WHERE sitterid = ?' , [user,user.sitterid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Edited Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        }
        else {
            if(!req.file) {
                var user = {
                    nurseryid : req.body.nurseryid,
                    username : req.body.username,
                    phonenumber : req.body.phonenumber,
                    emailaddress : req.body.emailaddress,
                    nationality : req.body.nationality,
                    brief : req.body.brief,
                    serviceprice : req.body.serviceprice,
                    gender : req.body.gender
                }
                connectDB.query('UPDATE nurseries SET ? WHERE nurseryid = ?' , [user,user.nurseryid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Edited Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
            else {
                var user = {
                    nurseryid : req.body.nurseryid,
                    userimage : `server/uploads/${req.file.filename}`,
                    username : req.body.username,
                    phonenumber : req.body.phonenumber,
                    emailaddress : req.body.emailaddress,
                    nationality : req.body.nationality,
                    brief : req.body.brief,
                    serviceprice : req.body.serviceprice,
                    gender : req.body.gender
                }
                connectDB.query('UPDATE nurseries SET ? WHERE nurseryid = ?' , [user,user.nurseryid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Edited Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        }
    },

    getRooms : (req,res) => {
        connectDB.query('SELECT * FROM rooms WHERE accountid = ? AND accounttype = ?' , [req.body.accountid,req.body.accounttype] , (err,rooms) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var json = JSON.stringify(rooms)
                    object = {
                        status : 200 ,
                        message : 'Success' ,
                        errors : [] ,
                        data : JSON.parse(json)
                    }
                res.send(object)
            }
        })
    },

    addRoom : (req,res) => {
        var room = {
            accountid : req.body.accountid,
            roomname : req.body.roomname,
            roomimage : `server/uploads/${req.file.filename}`,
            accounttype : req.body.accounttype
        }
        connectDB.query('INSERT INTO rooms SET ?' , [room] , (err,result) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var object = {
                    status : 200 ,
                    message : 'Room Saved Successfully' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    removeRoom : (req,res) => {
        var id = req.body.roomid

        connectDB.query('DELETE FROM rooms WHERE roomid = ?' , [id] , (err,result) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var object = {
                    status : 200 ,
                    message : 'Deleted Successfully' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },
    
    currentOrders : (req,res) => {
        let isPaid = 'false',
            orderstatus = 'false'
        connectDB.query('SELECT * FROM orders WHERE id = ? AND accounttype = ? AND orderstatus = ? AND isPaid = ?' , [req.body.id,req.body.accounttype,orderstatus,isPaid] , (err,orders) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!orders || orders.length == 0) {
                var object = {
                    status : 200 ,
                    message : 'No Orders' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var json = JSON.stringify(orders)
                    object = {
                        status : 200 ,
                        message : 'Success' ,
                        errors : [] ,
                        data : JSON.parse(json)
                    }
                res.send(object)
            }
        })
    },

    previousOrders : (req,res) => {
        let isPaid = 'true',
            orderstatus = 'true'
        connectDB.query('SELECT * FROM orders WHERE id = ? AND accounttype = ? AND orderstatus = ? AND isPaid = ?' , [req.body.id,req.body.accounttype,orderstatus,isPaid] , (err,orders) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!orders || orders.length == 0) {
                var object = {
                    status : 200 ,
                    message : 'No Orders' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var json = JSON.stringify(orders)
                    object = {
                        status : 200 ,
                        message : 'Success' ,
                        errors : [] ,
                        data : JSON.parse(json)
                    }
                res.send(object)
            }
        })
    },
    
    forgetPassword : (req,res) => {
        connectDB.query('SELECT sitterid,phonenumber,accounttype FROM sitters WHERE phonenumber = ?' , [req.body.phonenumber] , (err,sitter) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!sitter || sitter.length == 0) {
                connectDB.query('SELECT nurseryid,phonenumber,accounttype FROM nurseries WHERE phonenumber = ?' , [req.body.phonenumber] , (err,nursery) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!nursery || nursery.length == 0) {
                        var object = {
                            status : 400 ,
                            message : 'Phonenumber Is Not Found' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Success' ,
                            errors : [] ,
                            data : {
                                accounttype : nursery[0].accounttype,
                                nurseryid : nursery[0].nurseryid
                            }
                        }
                        res.send(object)
                    }
                })
            }
            else {
                var object = {
                    status : 200 ,
                    message : 'Success' ,
                    errors : [] ,
                    data : {
                        accounttype : sitter[0].accounttype,
                        sitterid : sitter[0].sitterid
                    }
                }
                res.send(object)
            }
        })
    },
    
    resetPassword : (req,res) => {
        if(req.body.accounttype == 'sitter') {
            var sitterid = req.body.id,
                password = req.body.password,
                confirmedPassword = req.body.confirmedPassword

            if(password != confirmedPassword) {
                var object = {
                    status : 400 ,
                    message : 'ConfirmedPassword Does Not Match Password' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                connectDB.query('UPDATE sitters SET password = ? WHERE sitterid = ?' , [password,sitterid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Password Changed Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        }
        else {
            var nurseryid = req.body.id,
                password = req.body.password,
                confirmedPassword = req.body.confirmedPassword

            if(password != confirmedPassword) {
                var object = {
                    status : 400 ,
                    message : 'ConfirmedPassword Does Not Match Password' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                connectDB.query('UPDATE nurseries SET password = ? WHERE nurseryid = ?' , [password,nurseryid] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Password Changed Successfully' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        }
    },
    
    confirmOrder : (req,res) => {
        let orderstatus = 'true',
            tokens = []
        connectDB.query('UPDATE orders SET orderstatus = ? WHERE orderid = ?' , [orderstatus,req.body.orderid] , (err,result) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                connectDB.query('SELECT customerid FROM orders WHERE orderid = ?' , [req.body.orderid] , (err,customer) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        connectDB.query('SELECT token FROM customers WHERE customerid = ?' , [customer[0].customerid] , (err,customer1) => {
                            if(err) {
                                var object = {
                                    status : 400 ,
                                    message : `${err}` ,
                                    errors : [] ,
                                    data : []
                                }
                                res.send(object)
                            }
                            else {
                                tokens.push(customer1[0].token)
                                var message = { 
                                    registration_ids: tokens,
    
                                    notification: {
                                        title: 'Haleemh notification',
                                        body: 'Order Confirmed',
                                        "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                        "icon": "fcm_push_icon"
                                    },
    
                                    data: {
                                        orderid : req.body.orderid
                                    }
                                }
                                let notification = {
                                    customerid   : customer[0].customerid,
                                    notification : message.notification.body,
                                    data         : JSON.stringify(message.data)
                                }
                                connectDB.query('INSERT INTO customernotifications SET ?' , [notification] , (err,results) => {
                                    if(err) {
                                        var object = {
                                            status: 400,
                                            message: `${err}`,
                                            errors: [],
                                            data: []
                                        }
                                        res.send(object)
                                    }
                                    else {
                                        fcmUser.send(message, function (err, response) {
                                            if (err) {
                                                var object = {
                                                    status: 400,
                                                    message: `${err}`,
                                                    errors: [],
                                                    data: []
                                                }
                                                res.send(object)
                                            }
                                            else {
                                                var object = {
                                                    status: 200,
                                                    message: 'Order Confirmed',
                                                    errors: [],
                                                    data: []
                                                }
                                                res.send(object)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    
    sendMessage : (req,res) => {
        let tokens = []
            message = {
            from_id     : req.body.from_id,
            to_id       : req.body.to_id,
            message     : req.body.message,
            time        : new Date().toLocaleTimeString(),
            accounttype : req.body.accounttype
        }
        connectDB.query('SELECT username,userimage,token FROM customers WHERE customerid = ?' , [message.to_id] , (err,customer) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(message.accounttype == 'sitter') {
                    connectDB.query('SELECT username,userimage FROM sitters WHERE sitterid = ?' , [message.from_id] , (err,sitter) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            connectDB.query('SELECT * FROM channels WHERE to_name = ? AND from_name = ?' , [customer[0].username,sitter[0].username] , (err,channels) => {
                                if(err) {
                                    var object = {
                                        status : 400 ,
                                        message : `${err}` ,
                                        errors : [] ,
                                        data : []
                                    }
                                    res.send(object)
                                }
                                else if(!channels || channels.length == 0) {
                                    let channel = {
                                        to_name   : customer[0].username,
                                        to_image  : customer[0].userimage,
                                        from_name     : sitter[0].username,
                                        from_image    : sitter[0].userimage,
                                        accounttype : message.accounttype
                                    }
                                    connectDB.query('INSERT INTO channels SET ?' , [channel] , (err,result) => {
                                        if(err) {
                                            var object = {
                                                status : 400 ,
                                                message : `${err}` ,
                                                errors : [] ,
                                                data : []
                                            }
                                            res.send(object)
                                        }
                                        else {
                                            let mes = {
                                                channel_id : result.insertId,
                                                from_id    : message.from_id,
                                                to_id      : message.to_id,
                                                message    : message.message,
                                                time       : message.time
                                            }
                                            connectDB.query('INSERT INTO messages SET ?' , [mes] , (err,results) => {
                                                if(err) {
                                                    var object = {
                                                        status : 400 ,
                                                        message : `${err}` ,
                                                        errors : [] ,
                                                        data : []
                                                    }
                                                    res.send(object)
                                                }
                                                else {
                                                    tokens.push(customer[0].token)
                                                    var message = { 
                                                        registration_ids: tokens,
                        
                                                        notification: {
                                                            title: 'Haleemh notification',
                                                            body: 'Message Recieved',
                                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                            "icon": "fcm_push_icon"
                                                        },
                        
                                                        data: {
                                                            from_id : mes.from_id,
                                                            to_id   : mes.to_id,
                                                            channel_id : mes.channel_id,
                                                            message : mes.message,
                                                            is_chat : 1
                                                        }
                                                    }
                                                    let notification = {
                                                        customerid   : message.data.to_id,
                                                        notification : message.notification.body,
                                                        data         : JSON.stringify(message.data)
                                                    }
                                                    connectDB.query('INSERT INTO customernotifications SET ?' , [notification] , (err,result1) => {
                                                        if(err) {
                                                            var object = {
                                                                status: 400,
                                                                message: `${err}`,
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                        else {
                                                            fcmUser.send(message, function (err, response) {
                                                                if (err) {
                                                                    var object = {
                                                                        status: 400,
                                                                        message: `${err}`,
                                                                        errors: [],
                                                                        data: []
                                                                    }
                                                                    res.send(object)
                                                                }
                                                                else {
                                                                    var object = {
                                                                        status : 200 ,
                                                                        message : 'Message Sent' ,
                                                                        errors : [] ,
                                                                        data : []
                                                                    }
                                                                    res.send(object)
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    let mes = {
                                        channel_id : channels[0].channel_id,
                                        from_id    : message.from_id,
                                        to_id      : message.to_id,
                                        message    : message.message,
                                        time       : message.time
                                    }
                                    connectDB.query('INSERT INTO messages SET ?' , [mes] , (err,results) => {
                                        if(err) {
                                            var object = {
                                                status : 400 ,
                                                message : `${err}` ,
                                                errors : [] ,
                                                data : []
                                            }
                                            res.send(object)
                                        }
                                        else {
                                            tokens.push(customer[0].token)
                                            var message = {
                                                registration_ids: tokens,

                                                notification: {
                                                    title: 'Haleemh notification',
                                                    body: 'Message Recieved',
                                                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                    "icon": "fcm_push_icon"
                                                },

                                                data: {
                                                    from_id: mes.from_id,
                                                    to_id: mes.to_id,
                                                    channel_id: mes.channel_id,
                                                    message: mes.message,
                                                    is_chat: 1
                                                }
                                            }
                                            let notification = {
                                                customerid: message.data.to_id,
                                                notification: message.notification.body,
                                                data: JSON.stringify(message.data)
                                            }
                                            connectDB.query('INSERT INTO customernotifications SET ?', [notification], (err, result1) => {
                                                if (err) {
                                                    var object = {
                                                        status: 400,
                                                        message: `${err}`,
                                                        errors: [],
                                                        data: []
                                                    }
                                                    res.send(object)
                                                }
                                                else {
                                                    fcmUser.send(message, function (err, response) {
                                                        if (err) {
                                                            var object = {
                                                                status: 400,
                                                                message: `${err}`,
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                        else {
                                                            var object = {
                                                                status: 200,
                                                                message: 'Message Sent',
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    connectDB.query('SELECT username,userimage FROM nurseries WHERE nurseryid = ?' , [message.from_id] , (err,nursery) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            connectDB.query('SELECT * FROM channels WHERE to_name = ? AND from_name = ?' , [customer[0].username,nursery[0].username] , (err,channels) => {
                                if(err) {
                                    var object = {
                                        status : 400 ,
                                        message : `${err}` ,
                                        errors : [] ,
                                        data : []
                                    }
                                    res.send(object)
                                }
                                else if(!channels || channels.length == 0) {
                                    let channel = {
                                        to_name  : customer[0].username,
                                        to_image : customer[0].userimage,
                                        from_name    : nursery[0].username,
                                        from_image   : nursery[0].userimage,
                                        accounttype : message.accounttype
                                    }
                                    connectDB.query('INSERT INTO channels SET ?' , [channel] , (err,result) => {
                                        if(err) {
                                            var object = {
                                                status : 400 ,
                                                message : `${err}` ,
                                                errors : [] ,
                                                data : []
                                            }
                                            res.send(object)
                                        }
                                        else {
                                            let mes = {
                                                channel_id : result.insertId,
                                                from_id    : message.from_id,
                                                to_id      : message.to_id,
                                                message    : message.message,
                                                time       : message.time
                                            }
                                            connectDB.query('INSERT INTO messages SET ?' , [mes] , (err,results) => {
                                                if(err) {
                                                    var object = {
                                                        status : 400 ,
                                                        message : `${err}` ,
                                                        errors : [] ,
                                                        data : []
                                                    }
                                                    res.send(object)
                                                }
                                                else {
                                                    tokens.push(customer[0].token)
                                                    var message = {
                                                        registration_ids: tokens,

                                                        notification: {
                                                            title: 'Haleemh notification',
                                                            body: 'Message Recieved',
                                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                            "icon": "fcm_push_icon"
                                                        },

                                                        data: {
                                                            from_id: mes.from_id,
                                                            to_id: mes.to_id,
                                                            channel_id: mes.channel_id,
                                                            message: mes.message,
                                                            is_chat: 1
                                                        }
                                                    }
                                                    let notification = {
                                                        customerid: message.data.to_id,
                                                        notification: message.notification.body,
                                                        data: JSON.stringify(message.data)
                                                    }
                                                    connectDB.query('INSERT INTO customernotifications SET ?', [notification], (err, result1) => {
                                                        if (err) {
                                                            var object = {
                                                                status: 400,
                                                                message: `${err}`,
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                        else {
                                                            fcmUser.send(message, function (err, response) {
                                                                if (err) {
                                                                    var object = {
                                                                        status: 400,
                                                                        message: `${err}`,
                                                                        errors: [],
                                                                        data: []
                                                                    }
                                                                    res.send(object)
                                                                }
                                                                else {
                                                                    var object = {
                                                                        status: 200,
                                                                        message: 'Message Sent',
                                                                        errors: [],
                                                                        data: []
                                                                    }
                                                                    res.send(object)
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    let mes = {
                                        channel_id : channels[0].channel_id,
                                        from_id    : message.from_id,
                                        to_id      : message.to_id,
                                        message    : message.message,
                                        time       : message.time
                                    }
                                    connectDB.query('INSERT INTO messages SET ?' , [mes] , (err,results) => {
                                        if(err) {
                                            var object = {
                                                status : 400 ,
                                                message : `${err}` ,
                                                errors : [] ,
                                                data : []
                                            }
                                            res.send(object)
                                        }
                                        else {
                                            tokens.push(customer[0].token)
                                            var message = {
                                                registration_ids: tokens,

                                                notification: {
                                                    title: 'Haleemh notification',
                                                    body: 'Message Recieved',
                                                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                    "icon": "fcm_push_icon"
                                                },

                                                data: {
                                                    from_id: mes.from_id,
                                                    to_id: mes.to_id,
                                                    channel_id: mes.channel_id,
                                                    message: mes.message,
                                                    is_chat: 1
                                                }
                                            }
                                            let notification = {
                                                customerid: message.data.to_id,
                                                notification: message.notification.body,
                                                data: JSON.stringify(message.data)
                                            }
                                            connectDB.query('INSERT INTO customernotifications SET ?', [notification], (err, result1) => {
                                                if (err) {
                                                    var object = {
                                                        status: 400,
                                                        message: `${err}`,
                                                        errors: [],
                                                        data: []
                                                    }
                                                    res.send(object)
                                                }
                                                else {
                                                    fcmUser.send(message, function (err, response) {
                                                        if (err) {
                                                            var object = {
                                                                status: 400,
                                                                message: `${err}`,
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                        else {
                                                            var object = {
                                                                status: 200,
                                                                message: 'Message Sent',
                                                                errors: [],
                                                                data: []
                                                            }
                                                            res.send(object)
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    showAllChats : (req,res) => {
        let from_id     = req.body.id,
            accounttype = req.body.accounttype
        
        if(accounttype == 'sitter') {
            connectDB.query('SELECT username FROM sitters WHERE sitterid = ?' , [from_id] , (err,sitter) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    connectDB.query('SELECT * FROM channels WHERE from_name = ?' , [sitter[0].username] , (err,channels) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var json = JSON.stringify(channels)
                                object = {
                                    status : 200 ,
                                    message : 'Success' ,
                                    errors : [] ,
                                    data : JSON.parse(json)
                                }
                            res.send(object)
                        }
                    })
                }
            })
        }
        else {
            connectDB.query('SELECT username FROM nurseries WHERE nurseryid = ?' , [from_id] , (err,nursery) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    connectDB.query('SELECT * FROM channels WHERE from_name = ?' , [nursery[0].username] , (err,channels) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var json = JSON.stringify(channels)
                                object = {
                                    status : 200 ,
                                    message : 'Success' ,
                                    errors : [] ,
                                    data : JSON.parse(json)
                                }
                            res.send(object)
                        }
                    })
                }
            })
        }
    },

    showChat : (req,res) => {
        let channel_id = req.body.channel_id
        connectDB.query('SELECT * FROM messages WHERE channel_id = ?' , [channel_id] , (err,messages) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!messages || messages.length == 0) {
                var object = {
                    status : 200 ,
                    message : 'No Messages' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var json = JSON.stringify(messages)
                    object = {
                        status: 200,
                        message: 'Success',
                        errors: [],
                        data: JSON.parse(json)
                    }
                res.send(object)
            }
        })
    },
    
    getAllNotifications : (req,res) => {
        let id = req.body.userid,
            accounttype = req.body.accounttype,
            notifications = []

        connectDB.query('SELECT * FROM sitternotifications WHERE userid = ? AND accounttype = ?' , [id,accounttype] , (err,notifications1) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!notifications1 || notifications1.length == 0) {
                var object = {
                    status : 200 ,
                    message : 'No Notifications' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                for(var i = 0; i < notifications1.length; i++) {
                    let notification = {
                        notificationid : notifications1[i].id,
                        userid : notifications1[i].userid,
                        notification : notifications1[i].notification,
                        data : JSON.parse(notifications1[i].data),
                        accounttype : notifications1[i].accounttype
                    }
                    notifications.push(notification)
                }
                var json = JSON.stringify(notifications)
                    object = {
                        status: 200,
                        message: 'Success',
                        errors: [],
                        data: JSON.parse(json)
                    }
                res.send(object)
            }
        })
    }
}