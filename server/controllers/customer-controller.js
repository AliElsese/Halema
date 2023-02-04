const connectDB = require('../database/connection')
const FCM = require('fcm-node');
var fcmUser = new FCM(process.env.SERVER_KEY_USER)
var fcmProvider = new FCM(process.env.SERVER_KEY_PROVIDER)

module.exports = {
    registerCustomer : (req,res) => {
        connectDB.query('SELECT phonenumber FROM customers WHERE phonenumber = ?' , [req.body.phonenumber] , (err,customer) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!customer || customer.length == 0) {
                connectDB.query('SELECT emailaddress FROM customers WHERE emailaddress = ?' , [req.body.emailaddress] , (err,customer1) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!customer1 || customer1.length == 0) {
                        var user = {
                            username : req.body.username,
                            emailaddress : req.body.emailaddress,
                            phonenumber : req.body.phonenumber,
                            nationality : req.body.nationality,
                            password : req.body.password,
                            city : req.body.city
                        }
                        connectDB.query('INSERT INTO customers SET ?' , [user] , (err,result) => {
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
                        var object = {
                            status : 400 ,
                            message : 'EmailAddress Is Already Taken' ,
                            errors : [] ,
                            data : []
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
    },

    loginCustomer : (req,res) => {
        let account = {
            phonenumber : req.body.phonenumber,
            password : req.body.password
        }
        connectDB.query('SELECT customerid,phonenumber,password FROM customers WHERE phonenumber = ?' , [account.phonenumber] , (err,customer) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!customer || customer.length == 0) {
                connectDB.query('SELECT monitorid,phonenumber,password FROM monitors WHERE phonenumber = ?' , [account.phonenumber] , (err,monitor) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!monitor || monitor.length == 0) {
                        var object = {
                            status : 400 ,
                            message : 'User Does Not Exist' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else {
                        if(monitor[0].password != account.password) {
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
                                    monitorid : monitor[0].monitorid
                                }
                            }
                            res.send(object)
                        }
                    }
                })
            }
            else {
                if(customer[0].password != account.password) {
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
                            customerid : customer[0].customerid
                        }
                    }
                    res.send(object)
                }
            }
        })
    },
    
    updateToken : (req,res) => {
        let account = {
            id : req.body.id,
            token : req.body.token
        }
        connectDB.query('UPDATE customers SET token = ? WHERE customerid = ?' , [account.token,account.id] , (err,result) => {
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
                        customerid : account.id
                    }
                }
                res.send(object)
            }
        })
    },
    
    sliderShow : (req,res) => {
        connectDB.query('SELECT * FROM posts' , (err,posts) => {
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
                var json = JSON.stringify(posts)
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
    
    getSitters : (req,res) => {
        var city = req.body.city
        connectDB.query('SELECT sitterid,userimage,username,rate,city,accounttype FROM sitters WHERE city = ?' , [city] , (err,sitters) => {
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
                var json = JSON.stringify(sitters)
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

    getSitterInfo : (req,res) => {
        if(req.body.accounttype == 'sitter') {
            connectDB.query('SELECT customerid,id,accounttype FROM favourites WHERE customerid = ? AND id = ? AND accounttype = ?' , [req.body.customerid,req.body.id,req.body.accounttype] , (err,favourites) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else if(!favourites || favourites.length == 0) {
                    connectDB.query('SELECT sitterid,userimage,username,rate,serviceprice,city,brief,phonenumber,accounttype FROM sitters WHERE sitterid = ?' , [req.body.id] , (err,sitters) => {
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
                            let sitter = {
                                sitterid : sitters[0].sitterid,
                                userimage : sitters[0].userimage,
                                username : sitters[0].username,
                                rate : sitters[0].rate,
                                serviceprice : sitters[0].serviceprice,
                                city : sitters[0].city,
                                brief : sitters[0].brief,
                                phonenumber : sitters[0].phonenumber,
                                accounttype : sitters[0].accounttype,
                                favourite : false
                            }
                            var object = {
                                status : 200 ,
                                message : 'Success' ,
                                errors : [] ,
                                data : {sitter}
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    connectDB.query('SELECT sitterid,userimage,username,rate,serviceprice,city,brief,phonenumber,accounttype FROM sitters WHERE sitterid = ?' , [req.body.id] , (err,sitters) => {
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
                            let sitter = {
                                sitterid : sitters[0].sitterid,
                                userimage : sitters[0].userimage,
                                username : sitters[0].username,
                                rate : sitters[0].rate,
                                serviceprice : sitters[0].serviceprice,
                                city : sitters[0].city,
                                brief : sitters[0].brief,
                                phonenumber : sitters[0].phonenumber,
                                accounttype : sitters[0].accounttype,
                                favourite : true
                            }
                            var object = {
                                status : 200 ,
                                message : 'Success' ,
                                errors : [] ,
                                data : {sitter}
                            }
                            res.send(object)
                        }
                    })
                }
            })
        }
        else {
            connectDB.query('SELECT customerid,id,accounttype FROM favourites WHERE customerid = ? AND id = ? AND accounttype = ?' , [req.body.customerid,req.body.id,req.body.accounttype] , (err,favourites) => {
                if(err) {
                    var object = {
                        status : 400 ,
                        message : `${err}` ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else if(!favourites || favourites.length == 0) {
                    connectDB.query('SELECT nurseryid,userimage,username,rate,city,serviceprice,brief,phonenumber,accounttype FROM nurseries WHERE nurseryid = ?' , [req.body.id] , (err,nurseries) => {
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
                            let nursery = {
                                nurseryid : nurseries[0].nurseryid,
                                userimage : nurseries[0].userimage,
                                username : nurseries[0].username,
                                rate : nurseries[0].rate,
                                city : nurseries[0].city,
                                serviceprice : nurseries[0].serviceprice,
                                brief : nurseries[0].brief,
                                phonenumber : nurseries[0].phonenumber,
                                accounttype : nurseries[0].accounttype,
                                favourite : false
                            }
                            var object = {
                                status : 200 ,
                                message : 'Success' ,
                                errors : [] ,
                                data : {nursery}
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    connectDB.query('SELECT nurseryid,userimage,username,rate,city,serviceprice,brief,phonenumber,accounttype FROM nurseries WHERE nurseryid = ?' , [req.body.id] , (err,nurseries) => {
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
                            let nursery = {
                                nurseryid : nurseries[0].nurseryid,
                                userimage : nurseries[0].userimage,
                                username : nurseries[0].username,
                                rate : nurseries[0].rate,
                                city : nurseries[0].city,
                                serviceprice : nurseries[0].serviceprice,
                                brief : nurseries[0].brief,
                                phonenumber : nurseries[0].phonenumber,
                                accounttype : nurseries[0].accounttype,
                                favourite : true
                            }
                            var object = {
                                status : 200 ,
                                message : 'Success' ,
                                errors : [] ,
                                data : {nursery}
                            }
                            res.send(object)
                        }
                    })
                }
            })
        }
    },

    getNursries : (req,res) => {
        var city = req.body.city
        connectDB.query('SELECT nurseryid,userimage,username,rate,city,accounttype FROM nurseries WHERE city = ?' , [city] , (err,nurseries) => {
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
                var json = JSON.stringify(nurseries)
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
    
    favouritesAction : (req,res) => {
        connectDB.query('SELECT favouriteid,customerid,id,accounttype FROM favourites WHERE customerid = ? AND id = ? AND accounttype = ?' , [req.body.customerid,req.body.id,req.body.accounttype] , (err,favourites) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!favourites || favourites.length == 0) {
                if(req.body.accounttype == 'sitter') {
                    connectDB.query('SELECT userimage,username,rate,city FROM sitters WHERE sitterid = ?' , [req.body.id] , (err,sitters) => {
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
                            var fav = {
                                customerid : req.body.customerid,
                                id : req.body.id,
                                accounttype : req.body.accounttype,
                                userimage : sitters[0].userimage,
                                username : sitters[0].username,
                                rate : sitters[0].rate,
                                city : sitters[0].city
                            }
                            connectDB.query('INSERT INTO favourites SET ?' , [fav] , (err,result) => {
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
                                        message : 'Added To Your Favourites' ,
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
                    connectDB.query('SELECT userimage,username,rate,city FROM nurseries WHERE nurseryid = ?' , [req.body.id] , (err,nurseries) => {
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
                            var fav = {
                                customerid : req.body.customerid,
                                id : req.body.id,
                                accounttype : req.body.accounttype,
                                userimage : nurseries[0].userimage,
                                username : nurseries[0].username,
                                rate : nurseries[0].rate,
                                city : nurseries[0].city
                            }
                            connectDB.query('INSERT INTO favourites SET ?' , [fav] , (err,result) => {
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
                                        message : 'Added To Your Favourites' ,
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
                connectDB.query('DELETE FROM favourites WHERE favouriteid = ?' , [favourites[0].favouriteid] , (err,result) => {
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
                            message : 'Deleted From Your Favourites' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        })
    },
    
    getFavourites : (req,res) => {
        var id = req.body.customerid,
            accounttypeSitter = 'sitter',
            accounttypeNursery = 'nursery'

        connectDB.query('SELECT * FROM favourites WHERE customerid = ? AND accounttype = ?' , [id,accounttypeSitter] , (err,favouriteSitters) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!favouriteSitters || favouriteSitters.length == 0) {
                connectDB.query('SELECT * FROM favourites WHERE customerid = ? AND accounttype = ?' , [id,accounttypeNursery] , (err,favouriteNurseries) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!favouriteNurseries || favouriteNurseries.length == 0) {
                        var object = {
                            status : 200 ,
                            message : 'No Favourites' ,
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
                                sitters : favouriteSitters,
                                nurseries : favouriteNurseries
                            }
                        }
                        res.send(object)
                    }
                })
            }
            else {
                connectDB.query('SELECT * FROM favourites WHERE customerid = ? AND accounttype = ?' , [id,accounttypeNursery] , (err,favouriteNurseries) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!favouriteNurseries || favouriteNurseries.length == 0) {
                        var object = {
                            status : 200 ,
                            message : 'Success' ,
                            errors : [] ,
                            data : {
                                sitters : favouriteSitters,
                                nurseries : favouriteNurseries
                            }
                        }
                        res.send(object)
                    }
                    else {
                        var object = {
                            status : 200 ,
                            message : 'Success' ,
                            errors : [] ,
                            data : {
                                sitters : favouriteSitters,
                                nurseries : favouriteNurseries
                            }
                        }
                        res.send(object)
                    }
                })
            }
        })
    },

    ratesList : (req,res) => {
        var id = req.body.id,
            accounttype = req.body.accounttype

        connectDB.query('SELECT * FROM rates WHERE id = ? AND accounttype = ?' , [id,accounttype] , (err,rates) => {
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
                var json = JSON.stringify(rates)
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
    
    sendRate : (req,res) => {
        var ss = {
            current_date : new Date().toLocaleDateString(),
            id : req.body.id,
            accounttype : req.body.accounttype,
            rate : req.body.rate,
            customerid : req.body.customerid
        }

        connectDB.query('SELECT username FROM customers WHERE customerid = ?' , [ss.customerid] , (err,customer) => {
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
                var rate1 = {
                    ratedate : ss.current_date,
                    username : customer[0].username,
                    rate : ss.rate,
                    id : ss.id,
                    accounttype : ss.accounttype
                }
                connectDB.query('INSERT INTO rates SET ?' , [rate1] , (err,result) => {
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
                            message : 'Rate Added' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
        })
    },

    sendOrder : (req,res) => {
        let tokens = []
        if(req.body.accounttype == 'sitter') {
            connectDB.query('SELECT username FROM customers WHERE customerid = ?' , [req.body.customerid] , (err,customer) => {
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
                    connectDB.query('SELECT name FROM monitors WHERE monitorid = ? AND customerid = ?' , [req.body.monitorid,req.body.customerid] , (err,monitor) => {
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
                            connectDB.query('SELECT username,userimage,serviceprice,token FROM sitters WHERE sitterid = ?' , [req.body.id] , (err,sitter) => {
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
                                    var order = {
                                        customerid : req.body.customerid,
                                        customername : customer[0].username,
                                        hours : req.body.hours,
                                        date : new Date(`${req.body.date}`).toLocaleDateString(),
                                        monitorid : req.body.monitorid,
                                        monitorname : monitor[0].name,
                                        childrennumber : JSON.parse(req.body['children']).length,
                                        id : req.body.id,
                                        username : sitter[0].username,
                                        userimage : sitter[0].userimage,
                                        accounttype : req.body.accounttype,
                                        orderprice : (parseInt(req.body.hours) * parseInt(sitter[0].serviceprice)).toString()
                                    }
                                    connectDB.query('INSERT INTO orders SET ?' , [order] , (err,result) => {
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
                                            connectDB.query('SELECT childid,name FROM children WHERE childid In (?)' , [JSON.parse(req.body['children'])] , (err,children) => {
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
                                                    for(var x = 0; x < children.length; x++) {
                                                        var child = {
                                                            orderid : result.insertId,
                                                            childid : children[x].childid,
                                                            childname : children[x].name
                                                        }
                                                        connectDB.query('INSERT INTO orderchildren SET ?' , [child] ,(err,result1) => {
                                                            if(err) {
                                                                var object = {
                                                                    status : 400 ,
                                                                    message : `${err}` ,
                                                                    errors : [] ,
                                                                    data : []
                                                                }
                                                                res.send(object)
                                                            }
                                                        })
                                                    }
                                                    tokens.push(sitter[0].token)
                                                    var message = { 
                                                        registration_ids: tokens,
                        
                                                        notification: {
                                                            title: 'Haleemh notification',
                                                            body: 'Order Recieved',
                                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                            "icon": "fcm_push_icon"
                                                        },
                        
                                                        data: {
                                                            orderid : result.insertId
                                                        }
                                                    };
                                                    let notification = {
                                                        userid       : req.body.id,
                                                        notification : message.notification.body,
                                                        data         : JSON.stringify(message.data),
                                                        accounttype  : req.body.accounttype
                                                    }
                                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                            fcmProvider.send(message, function (err, response) {
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
                                                                        message: 'Order Sent',
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
                    })
                }
            })
        }
        else {
            connectDB.query('SELECT username FROM customers WHERE customerid = ?' , [req.body.customerid] , (err,customer) => {
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
                    connectDB.query('SELECT name FROM monitors WHERE monitorid = ? AND customerid = ?' , [req.body.monitorid,req.body.customerid] , (err,monitor) => {
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
                            connectDB.query('SELECT username,userimage,serviceprice,token FROM nurseries WHERE nurseryid = ?' , [req.body.id] , (err,nursery) => {
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
                                    var order = {
                                        customerid : req.body.customerid,
                                        customername : customer[0].username,
                                        hours : req.body.hours,
                                        date : new Date(`${req.body.date}`).toLocaleDateString(),
                                        monitorid : req.body.monitorid,
                                        monitorname : monitor[0].name,
                                        childrennumber : JSON.parse(req.body['children']).length,
                                        id : req.body.id,
                                        username : nursery[0].username,
                                        userimage : nursery[0].userimage,
                                        accounttype : req.body.accounttype,
                                        orderprice : (parseInt(req.body.hours) * parseInt(nursery[0].serviceprice)).toString()
                                    }
                                    connectDB.query('INSERT INTO orders SET ?' , [order] , (err,result) => {
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
                                            connectDB.query('SELECT childid,name FROM children WHERE childid In (?)' , [JSON.parse(req.body['children'])] , (err,children) => {
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
                                                    for(var x = 0; x < children.length; x++) {
                                                        var child = {
                                                            orderid : result.insertId,
                                                            childid : children[x].childid,
                                                            childname : children[x].name
                                                        }
                                                        connectDB.query('INSERT INTO orderchildren SET ?' , [child] ,(err,result1) => {
                                                            if(err) {
                                                                var object = {
                                                                    status : 400 ,
                                                                    message : `${err}` ,
                                                                    errors : [] ,
                                                                    data : []
                                                                }
                                                                res.send(object)
                                                            }
                                                        })
                                                    }
                                                    tokens.push(nursery[0].token)
                                                    var message = { 
                                                        registration_ids: tokens,
                        
                                                        notification: {
                                                            title: 'Haleemh notification',
                                                            body: 'Order Recieved',
                                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                                            "icon": "fcm_push_icon"
                                                        },
                        
                                                        data: {
                                                            orderid : result.insertId
                                                        }
                                                    };
                                                    let notification = {
                                                        userid       : req.body.id,
                                                        notification : message.notification.body,
                                                        data         : JSON.stringify(message.data),
                                                        accounttype  : req.body.accounttype
                                                    }
                                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                            fcmProvider.send(message, function (err, response) {
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
                                                                        message: 'Order Sent',
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
                    })
                }
            })
        }
    },

    currentOrders : (req,res) => {
        let isPaid = 'false',
            orderstatus = 'true'
        connectDB.query('SELECT * FROM orders WHERE customerid = ? AND orderstatus = ? AND isPaid = ?' , [req.body.customerid,orderstatus,isPaid] , (err,orders) => {
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
        connectDB.query('SELECT * FROM orders WHERE customerid = ? AND orderstatus = ? AND isPaid = ?' , [req.body.customerid,orderstatus,isPaid] , (err,orders) => {
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

    getCustomerInfo : (req,res) => {
        var id = req.body.customerid

        connectDB.query('SELECT * FROM customers WHERE customerid = ?' , [id] , (err,customer) => {
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
                var json = JSON.stringify(customer)
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

    updateInfo : (req,res) => {
        if(!req.file) {
            var user = {
                customerid : req.body.customerid,
                username : req.body.username,
                phonenumber : req.body.phonenumber,
                emailaddress : req.body.emailaddress,
                nationality : req.body.nationality,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString(),
                gender : req.body.gender,
                city: req.body.city
                
            }
            connectDB.query('UPDATE customers SET ? WHERE customerid = ?' , [user,user.customerid] , (err,result) => {
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
                customerid : req.body.customerid,
                userimage : `server/uploads/${req.file.filename}`,
                username : req.body.username,
                phonenumber : req.body.phonenumber,
                emailaddress : req.body.emailaddress,
                nationality : req.body.nationality,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString(),
                gender : req.body.gender,
                city : req.body.city
            
            }
            connectDB.query('UPDATE customers SET ? WHERE customerid = ?' , [user,user.customerid] , (err,result) => {
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
    },

    getAllChildren : (req,res) => {
        var id = req.body.customerid
        
        connectDB.query('SELECT childid,name FROM children WHERE customerid = ?' , [id] , (err,children) => {
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
                var json = JSON.stringify(children)
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

    addChild : (req,res) => {
        var child = {
            customerid : req.body.customerid,
            name : req.body.name,
            dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString(),
            nationality : req.body.nationality,
            gender : req.body.gender,
            hoppy : req.body.hoppy,
            diseases : req.body.diseases,
            additionalinformation : req.body.additionalinformation
        }
        connectDB.query('INSERT INTO children SET ?' , [child] , (err,result) => {
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
                    message : 'Child Saved Successfully' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    removeChild : (req,res) => {
        var id = req.body.childid

        connectDB.query('DELETE FROM children WHERE childid = ?' , [id] , (err,result) => {
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

    getAllMonitors : (req,res) => {
        var id = req.body.customerid
        
        connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [id] , (err,monitors) => {
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
                var json = JSON.stringify(monitors)
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

    addMonitor : (req,res) => {
        let monitor = {
            customerid : req.body.customerid,
            name : req.body.name,
            phonenumber : req.body.phonenumber,
            emailaddress : req.body.emailaddress,
            dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString(),
            password : req.body.password,
            gender : req.body.gender
        }
        connectDB.query('SELECT phonenumber FROM customers WHERE phonenumber = ?' , [monitor.phonenumber] , (err,result) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!result || result.length == 0) {
                connectDB.query('SELECT phonenumber FROM monitors WHERE phonenumber = ?' , [monitor.phonenumber] , (err,result1) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else if(!result1 || result1.length == 0) {
                        connectDB.query('INSERT INTO monitors SET ?' , [monitor] , (err,results) => {
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
                                    message : 'Monitor Saved Successfully' ,
                                    errors : [] ,
                                    data : []
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
                var object = {
                    status : 400 ,
                    message : 'Phone Is Already Taken' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    removeMonitor : (req,res) => {
        var id = req.body.monitorid

        connectDB.query('DELETE FROM monitors WHERE monitorid = ?' , [id] , (err,result) => {
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
    
    aboutusText : (req,res) => {
        connectDB.query('SELECT about FROM haleemhinfo' , (err,info) => {
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
                        message : 'Success' ,
                        errors : [] ,
                        data : {about : info[0].about}
                    }
                res.send(object)
            }
        })
    },
    
    termsText : (req,res) => {
        connectDB.query('SELECT terms,phonenumber FROM haleemhinfo' , (err,info) => {
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
                        message : 'Success' ,
                        errors : [] ,
                        data : {
                            terms : info[0].terms,
                            phonenumber : info[0].phonenumber
                        }
                    }
                res.send(object)
            }
        })
    },
    
    forgetPassword : (req,res) => {
        connectDB.query('SELECT customerid,phonenumber FROM customers WHERE phonenumber = ?' , [req.body.phonenumber] , (err,customer) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!customer || customer.length == 0) {
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
                    data : {customerid : customer[0].customerid}
                }
                res.send(object)
            }
        })
    },
    
    resetPassword : (req,res) => {
        var customerid = req.body.customerid,
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
            connectDB.query('UPDATE customers SET password = ? WHERE customerid = ?' , [password,customerid] , (err,result) => {
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
    },
    
    sendMessage : (req,res) => {
        let tokens = [],
            message = {
            from_id     : req.body.from_id,
            to_id       : req.body.to_id,
            message     : req.body.message,
            time        : new Date().toLocaleTimeString(),
            accounttype : req.body.accounttype
        }
        connectDB.query('SELECT username,userimage FROM customers WHERE customerid = ?' , [message.from_id] , (err,customer) => {
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
                    connectDB.query('SELECT username,userimage,token FROM sitters WHERE sitterid = ?' , [message.to_id] , (err,sitter) => {
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
                            connectDB.query('SELECT * FROM channels WHERE from_name = ? AND to_name = ?' , [customer[0].username,sitter[0].username] , (err,channels) => {
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
                                        from_name   : customer[0].username,
                                        from_image  : customer[0].userimage,
                                        to_name     : sitter[0].username,
                                        to_image    : sitter[0].userimage,
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
                                                    tokens.push(sitter[0].token)
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
                                                        userid       : message.data.to_id,
                                                        notification : message.notification.body,
                                                        data         : JSON.stringify(message.data),
                                                        accounttype  : req.body.accounttype
                                                    }
                                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                            fcmProvider.send(message, function (err, response) {
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
                                            tokens.push(sitter[0].token)
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
                                                userid       : message.data.to_id,
                                                notification : message.notification.body,
                                                data         : JSON.stringify(message.data),
                                                accounttype  : req.body.accounttype
                                            }
                                            connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                    fcmProvider.send(message, function (err, response) {
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
                    })
                }
                else {
                    connectDB.query('SELECT username,userimage,token FROM nurseries WHERE nurseryid = ?' , [message.to_id] , (err,nursery) => {
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
                            connectDB.query('SELECT * FROM channels WHERE from_name = ? AND to_name = ?' , [customer[0].username,nursery[0].username] , (err,channels) => {
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
                                        from_name  : customer[0].username,
                                        from_image : customer[0].userimage,
                                        to_name    : nursery[0].username,
                                        to_image   : nursery[0].userimage
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
                                                    tokens.push(nursery[0].token)
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
                                                        userid       : message.data.to_id,
                                                        notification : message.notification.body,
                                                        data         : JSON.stringify(message.data),
                                                        accounttype  : req.body.accounttype
                                                    }
                                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                            fcmProvider.send(message, function (err, response) {
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
                                            tokens.push(nursery[0].token)
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
                                                userid       : message.data.to_id,
                                                notification : message.notification.body,
                                                data         : JSON.stringify(message.data),
                                                accounttype  : req.body.accounttype
                                            }
                                            connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                                    fcmProvider.send(message, function (err, response) {
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
                    })
                }
            }
        })
    },
    
    showAllChats : (req,res) => {
        let from_id = req.body.customerid
        connectDB.query('SELECT username FROM customers WHERE customerid = ?' , [from_id] , (err,customer) => {
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
                connectDB.query('SELECT * FROM channels WHERE from_name = ?' , [customer[0].username] , (err,channels) => {
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
        let id = req.body.customerid,
            notifications = []
        connectDB.query('SELECT * FROM customernotifications WHERE customerid = ?' , [id] , (err,notifications1) => {
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
                        customerid     : notifications1[i].customerid,
                        notification   : notifications1[i].notification,
                        data           : JSON.parse(notifications1[i].data)
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
    },
    
    orderPaid : (req,res) => {
        var id = req.body.orderid,
            isPaid = 'true'
        connectDB.query('SELECT id,accounttype FROM orders WHERE orderid = ?' , [id] , (err,order) => {
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
                if(order[0].accounttype == 'sitter') {
                    connectDB.query('SELECT token FROM sitters WHERE sitterid = ?' , [order[0].id] , (err,sitter) => {
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
                            let tokens = []
                            tokens.push(sitter[0].token)
                            connectDB.query('UPDATE orders SET isPaid = ? WHERE orderid = ?' , [isPaid,id] , (err,result) => {
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
                                    var message = {
                                        registration_ids: tokens,

                                        notification: {
                                            title: 'Haleemh notification',
                                            body: 'Order Is Paid',
                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                            "icon": "fcm_push_icon"
                                        },

                                        data: {
                                            orderid : id
                                        }
                                    }
                                    let notification = {
                                        userid       : order[0].id,
                                        notification : message.notification.body,
                                        data         : JSON.stringify(message.data),
                                        accounttype  : order[0].accounttype
                                    }
                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                            fcmProvider.send(message, function (err, response) {
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
                                                        message : 'Order Is Paid' ,
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
                    connectDB.query('SELECT token FROM nurseries WHERE nurseryid = ?' , [order[0].id] , (err,nursery) => {
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
                            let tokens = []
                            tokens.push(nursery[0].token)
                            connectDB.query('UPDATE orders SET isPaid = ? WHERE orderid = ?' , [isPaid,id] , (err,result) => {
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
                                    var message = {
                                        registration_ids: tokens,

                                        notification: {
                                            title: 'Haleemh notification',
                                            body: 'Order Is Paid',
                                            "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                            "icon": "fcm_push_icon"
                                        },

                                        data: {
                                            orderid : id
                                        }
                                    }
                                    let notification = {
                                        userid       : order[0].id,
                                        notification : message.notification.body,
                                        data         : JSON.stringify(message.data),
                                        accounttype  : order[0].accounttype
                                    }
                                    connectDB.query('INSERT INTO sitternotifications SET ?' , [notification] , (err,result1) => {
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
                                            fcmProvider.send(message, function (err, response) {
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
                                                        message : 'Order Is Paid' ,
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
            }
        })
    }
}