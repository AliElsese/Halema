const connectDB = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    showLoginPage : (req,res) => {
        res.render('login')
    },

    loginAdmin : (req,res) => {
        try {
            var {email , password} = req.body
            
            if(!email || !password) {
                res.render('login' , {
                    message : 'من فضلك قم بادخال اسمك وكلمة السر'
                })
            } else {
                connectDB.query('SELECT * FROM admins WHERE email = ?' , [ email ] , async (err , results) => {
                    if(err) res.send(err)
                    else if(!results || results.length == 0 || password != results[0].password){
                        res.render('login' , {
                            message : 'اسم المستخدم او كلمة السر خطأ'
                        })
                    } 
                    else {
                        var id = results[0].adminid
                        var token = jwt.sign({id : id} , process.env.JWT_SECRET , {
                            expiresIn : process.env.JWT_EXPIRES_IN
                        })
                        var cookieOptions = {
                            expires : new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            
                            httpOnly : false,
                            secure : false
                        }
                        res.cookie('jwt' , token , cookieOptions)
                        connectDB.query('SELECT sitterid FROM sitters' , (err,sitters) => {
                            if(err) res.send(err)
                            else {
                                connectDB.query('SELECT nurseryid FROM nurseries' , (err,nurseries) => {
                                    if(err) res.send(err)
                                    else {
                                        connectDB.query('SELECT customerid FROM customers' , (err,customers) => {
                                            if(err) res.send(err)
                                            else {
                                                connectDB.query('SELECT childid FROM children' , (err,children) => {
                                                    if(err) res.send(err)
                                                    else {
                                                        connectDB.query('SELECT monitorid FROM monitors' , (err,monitors) => {
                                                            if(err) res.send(err)
                                                            connectDB.query('SELECT orderid FROM orders' , (err,orders) => {
                                                                if(err) res.send(err)
                                                                else {
                                                                    let statistics = {
                                                                        sittersNumber : sitters.length,
                                                                        nurseriesNumber : nurseries.length,
                                                                        customersNumber : customers.length,
                                                                        childrenNumber : children.length,
                                                                        monitorsNumber : monitors.length,
                                                                        ordersNumber : orders.length
                                                                    }
                                                                    res.render('dashboard' , {
                                                                        statistics : statistics
                                                                    })
                                                                }
                                                            })
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
        } catch (error) {
            res.send(error)
        }
    },

    showDashboardPage : (req,res) => {
        connectDB.query('SELECT sitterid FROM sitters' , (err,sitters) => {
            if(err) res.send(err)
            else {
                connectDB.query('SELECT nurseryid FROM nurseries' , (err,nurseries) => {
                    if(err) res.send(err)
                    else {
                        connectDB.query('SELECT customerid FROM customers' , (err,customers) => {
                            if(err) res.send(err)
                            else {
                                connectDB.query('SELECT childid FROM children' , (err,children) => {
                                    if(err) res.send(err)
                                    else {
                                        connectDB.query('SELECT monitorid FROM monitors' , (err,monitors) => {
                                            if(err) res.send(err)
                                            connectDB.query('SELECT orderid FROM orders' , (err,orders) => {
                                                if(err) res.send(err)
                                                else {
                                                    let statistics = {
                                                        sittersNumber : sitters.length,
                                                        nurseriesNumber : nurseries.length,
                                                        customersNumber : customers.length,
                                                        childrenNumber : children.length,
                                                        monitorsNumber : monitors.length,
                                                        ordersNumber : orders.length
                                                    }
                                                    res.render('dashboard' , {
                                                        statistics : statistics
                                                    })
                                                }
                                            })
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

    showDashboardSittersPage : (req,res) => {
        connectDB.query('SELECT * FROM sitters' , (err,sitters) => {
            if(err) res.send(err)
            res.render('dashboard-sitters' , {
                sitters : sitters
            })
        })
    },

    showAddSitterPage : (req,res) => {
        res.render('add-sitter')
    },

    addSitter : (req,res) => {
        try {
            let sitter = {
                username : req.body.username,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                brief : req.body.brief,
                serviceprice : req.body.serviceprice
            }
            if(!sitter.username || !sitter.gender || !sitter.emailaddress || !sitter.phonenumber || !sitter.nationality || !sitter.password || !sitter.brief || !sitter.serviceprice) {
                res.render('add-sitter' , {
                    message : 'املأ جميع البيانات'
                })
            }
            else {
                connectDB.query('INSERT INTO sitters SET ?' , [sitter] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM sitters' , (err,sitters) => {
                        if(err) res.send(err)
                        res.render('dashboard-sitters' , {
                            sitters : sitters,
                            message : 'تم الإضافة'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showUpdateSitterPage : (req,res) => {
        connectDB.query('SELECT * FROM sitters WHERE sitterid = ?' , [req.params.sitterid] , (err,sitter) => {
            if(err) res.send(err)
            res.render('update-sitter' , {
                sitter : sitter
            })
        })
    },

    updateSitter : (req,res) => {
        try {
            let sitter1 = {
                username : req.body.username,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                brief : req.body.brief,
                serviceprice : req.body.serviceprice
            }
            if(!sitter1.username || !sitter1.gender || !sitter1.emailaddress || !sitter1.phonenumber || !sitter1.nationality || !sitter1.password || !sitter1.brief || !sitter1.serviceprice) {
                connectDB.query('SELECT * FROM sitters WHERE sitterid = ?' , [req.body.sitterid] , (err,sitter) => {
                    if(err) res.send(err)
                    res.render('update-sitter' , {
                        sitter : sitter,
                        message : 'املأ جميع البيانات'
                    })
                })
            }
            else {
                connectDB.query('UPDATE sitters SET ? WHERE sitterid = ?' , [sitter1,req.body.sitterid] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM sitters' , (err,sitters) => {
                        if(err) res.send(err)
                        res.render('dashboard-sitters' , {
                            sitters : sitters,
                            message : 'تم التعديل'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    deleteSitter : (req,res) => {
        connectDB.query('DELETE FROM sitters WHERE sitterid = ?' , [req.params.sitterid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('DELETE FROM sitterpapers WHERE sitterid = ?' , [req.params.sitterid] , (err,result2) => {
                if(err) res.send(err)
                connectDB.query('SELECT * FROM sitters' , (err,sitters) => {
                    if(err) res.send(err)
                    res.render('dashboard-sitters' , {
                        sitters : sitters,
                        message : 'تم الحذف'
                    })
                })
            })
        })
    },

    showSitterPapersPage : (req,res) => {
        connectDB.query('SELECT * FROM sitterpapers WHERE sitterid = ?' , [req.params.sitterid] , (err,papers) => {
            if(err) res.send(err)
            res.render('sitter-papers' , {
                papers : papers
            })
        })
    },

    showDashboardNurseriesPage : (req,res) => {
        connectDB.query('SELECT * FROM nurseries' , (err,nurseries) => {
            if(err) res.send(err)
            res.render('dashboard-nurseries' , {
                nurseries : nurseries
            })
        })
    },

    showAddNurseryPage : (req,res) => {
        res.render('add-nursery')
    },

    addNursery : (req,res) => {
        try {
            let nursery = {
                username : req.body.username,
                nurseryname : req.body.nurseryname,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                brief : req.body.brief,
                serviceprice : req.body.serviceprice
            }
            if(!nursery.username || !nursery.nurseryname || !nursery.emailaddress || !nursery.phonenumber || !nursery.nationality || !nursery.password || !nursery.brief || !nursery.serviceprice) {
                res.render('add-nursery' , {
                    message : 'املأ جميع البيانات'
                })
            }
            else {
                connectDB.query('INSERT INTO nurseries SET ?' , [nursery] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM nurseries' , (err,nurseries) => {
                        if(err) res.send(err)
                        res.render('dashboard-nurseries' , {
                            nurseries : nurseries,
                            message : 'تم الإضافة'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showUpdateNurseryPage : (req,res) => {
        connectDB.query('SELECT * FROM nurseries WHERE nurseryid = ?' , [req.params.nurseryid] , (err,nursery) => {
            if(err) res.send(err)
            res.render('update-nursery' , {
                nursery : nursery
            })
        })
    },

    updateNursery : (req,res) => {
        try {
            let nursery1 = {
                username : req.body.username,
                nurseryname : req.body.nurseryname,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                brief : req.body.brief,
                serviceprice : req.body.serviceprice
            }
            if(!nursery1.username || !nursery1.nurseryname || !nursery1.emailaddress || !nursery1.phonenumber || !nursery1.nationality || !nursery1.password || !nursery1.brief || !nursery1.serviceprice) {
                connectDB.query('SELECT * FROM nurseries WHERE nurseryid = ?' , [req.body.nurseryid] , (err,nursery) => {
                    if(err) res.send(err)
                    res.render('update-nursery' , {
                        nursery : nursery,
                        message : 'املأ جميع البيانات'
                    })
                })
            }
            else {
                connectDB.query('UPDATE nurseries SET ? WHERE nurseryid = ?' , [nursery1,req.body.nurseryid] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM nurseries' , (err,nurseries) => {
                        if(err) res.send(err)
                        res.render('dashboard-nurseries' , {
                            nurseries : nurseries,
                            message : 'تم التعديل'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    deleteNursery : (req,res) => {
        connectDB.query('DELETE FROM nurseries WHERE nurseryid = ?' , [req.params.nurseryid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('DELETE FROM nurserypapers WHERE nurseryid = ?' , [req.params.nurseryid] , (err,result2) => {
                if(err) res.send(err)
                connectDB.query('SELECT * FROM nurseries' , (err,nurseries) => {
                    if(err) res.send(err)
                    res.render('dashboard-nurseries' , {
                        nurseries : nurseries,
                        message : 'تم الحذف'
                    })
                })
            })
        })
    },

    showNurseryPapersPage : (req,res) => {
        connectDB.query('SELECT * FROM nurserypapers WHERE nurseryid = ?' , [req.params.nurseryid] , (err,papers) => {
            if(err) res.send(err)
            res.render('nursery-papers' , {
                papers : papers
            })
        })
    },

    showDashboardCustomersPage : (req,res) => {
        connectDB.query('SELECT * FROM customers' , (err,customers) => {
            if(err) res.send(err)
            res.render('dashboard-customers' , {
                customers : customers
            })
        })
    },

    showAddCustomerPage : (req,res) => {
        res.render('add-customer')
    },

    addCustomer : (req,res) => {
        try {
            let customer = {
                username : req.body.username,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!customer.username || !customer.gender || !customer.emailaddress || !customer.phonenumber || !customer.nationality || !customer.password || !customer.dateofbirth) {
                res.render('add-customer' , {
                    message : 'املأ جميع البيانات'
                })
            }
            else {
                connectDB.query('INSERT INTO customers SET ?' , [customer] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM customers' , (err,customers) => {
                        if(err) res.send(err)
                        res.render('dashboard-customers' , {
                            customers : customers,
                            message : 'تم الإضافة'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showUpdateCustomerPage : (req,res) => {
        connectDB.query('SELECT * FROM customers WHERE customerid = ?' , [req.params.customerid] , (err,customer) => {
            if(err) res.send(err)
            res.render('update-customer' , {
                customer : customer
            })
        })
    },

    updateCustomer : (req,res) => {
        try {
            let customer1 = {
                username : req.body.username,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                nationality : req.body.nationality,
                password : req.body.password,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!customer1.username || !customer1.gender || !customer1.emailaddress || !customer1.phonenumber || !customer1.nationality || !customer1.password || !customer1.dateofbirth) {
                connectDB.query('SELECT * FROM customers WHERE customerid = ?' , [req.body.customerid] , (err,customer) => {
                    if(err) res.send(err)
                    res.render('update-customer' , {
                        customer : customer,
                        message : 'املأ جميع البيانات'
                    })
                })
            }
            else {
                connectDB.query('UPDATE customers SET ? WHERE customerid = ?' , [customer1,req.body.customerid] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM customers' , (err,customers) => {
                        if(err) res.send(err)
                        res.render('dashboard-customers' , {
                            customers : customers,
                            message : 'تم التعديل'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    deleteCustomer : (req,res) => {
        connectDB.query('DELETE FROM customers WHERE customerid = ?', [req.params.customerid], (err, result2) => {
            if (err) res.send(err)
            connectDB.query('SELECT * FROM customers', (err, customers) => {
                if (err) res.send(err)
                res.render('dashboard-customers', {
                    customers: customers,
                    message: 'تم الحذف'
                })
            })
        })
    },

    showDashboardCustomerRelationsPage : (req,res) => {
        connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.params.customerid] , (err,children) => {
            if(err) res.send(err)
            else {
                connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.params.customerid] , (err,monitors) => {
                    if(err) res.send(err)
                    res.render('dashboard-relations' , {
                        children : children,
                        monitors : monitors
                    })
                })
            }
        })
    },

    showAddMonitorPage : (req,res) => {
        let customerid = req.params.customerid
        res.render('add-monitor' , {
            customerid : customerid
        })
    },

    addMonitor : (req,res) => {
        try {
            let monitor = {
                customerid : req.body.customerid,
                name : req.body.name,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                password : req.body.password,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!monitor.name || !monitor.gender || !monitor.emailaddress || !monitor.phonenumber || !monitor.password || !monitor.dateofbirth) {
                res.render('add-monitor' , {
                    customerid : monitor.customerid,
                    message : 'املأ جميع البيانات'
                })
            }
            else {
                connectDB.query('INSERT INTO monitors SET ?' , [monitor] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.body.customerid] , (err,monitors) => {
                        if(err) res.send(err)
                        connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.body.customerid] , (err,children) => {
                            if(err) res.send(err)
                            res.render('dashboard-relations' , {
                                monitors : monitors,
                                children : children,
                                message : 'تم الإضافة'
                            })
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showUpdateMonitorPage : (req,res) => {
        connectDB.query('SELECT * FROM monitors WHERE monitorid = ?' , [req.params.monitorid] , (err,monitor) => {
            if(err) res.send(err)
            res.render('update-monitor' , {
                monitor : monitor
            })
        })
    },

    updateMonitor : (req,res) => {
        try {
            let monitor1 = {
                name : req.body.name,
                gender : req.body.gender,
                emailaddress : req.body.emailaddress,
                phonenumber : req.body.phonenumber,
                password : req.body.password,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!monitor1.name || !monitor1.gender || !monitor1.emailaddress || !monitor1.phonenumber || !monitor1.password || !monitor1.dateofbirth) {
                connectDB.query('SELECT * FROM monitors WHERE monitorid = ?' , [req.body.monitorid] , (err,monitor) => {
                    if(err) res.send(err)
                    res.render('update-monitor' , {
                        monitor : monitor,
                        message : 'املأ جميع البيانات'
                    })
                })
            }
            else {
                connectDB.query('UPDATE monitors SET ? WHERE monitorid = ?' , [monitor1,req.body.monitorid] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.body.customerid] , (err,monitors) => {
                        if(err) res.send(err)
                        connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.body.customerid] , (err,children) => {
                            if(err) res.send(err)
                            res.render('dashboard-relations' , {
                                children : children,
                                monitors : monitors,
                                message : 'تم التعديل'
                            })
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    deleteMonitor : (req,res) => {
        connectDB.query('DELETE FROM monitors WHERE monitorid = ?', [req.params.monitorid], (err, result2) => {
            if (err) res.send(err)
            connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.params.customerid] , (err, monitors) => {
                if (err) res.send(err)
                connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.params.customerid] , (err,children) => {
                    if(err) res.send(err)
                    res.render('dashboard-relations', {
                        monitors: monitors,
                        children : children,
                        message: 'تم الحذف'
                    })
                })
            })
        })
    },

    showAddChildrenPage : (req,res) => {
        let customerid = req.params.customerid
        res.render('add-child' , {
            customerid : customerid
        })
    },

    addChildren : (req,res) => {
        try {
            let child = {
                customerid : req.body.customerid,
                name : req.body.name,
                gender : req.body.gender,
                nationality : req.body.nationality,
                hoppy : req.body.hoppy,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!child.name || !child.gender || !child.nationality || !child.hoppy || !child.dateofbirth) {
                res.render('add-child' , {
                    customerid : child.customerid,
                    message : 'املأ جميع البيانات'
                })
            }
            else {
                connectDB.query('INSERT INTO children SET ?' , [child] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.body.customerid] , (err,monitors) => {
                        if(err) res.send(err)
                        connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.body.customerid] , (err,children) => {
                            if(err) res.send(err)
                            res.render('dashboard-relations' , {
                                monitors : monitors,
                                children : children,
                                message : 'تم الإضافة'
                            })
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showUpdateChildrenPage : (req,res) => {
        connectDB.query('SELECT * FROM children WHERE childid = ?' , [req.params.childid] , (err,children) => {
            if(err) res.send(err)
            res.render('update-children' , {
                children : children
            })
        })
    },

    updateChildren : (req,res) => {
        try {
            let child1 = {
                name : req.body.name,
                gender : req.body.gender,
                nationality : req.body.nationality,
                hoppy : req.body.hoppy,
                dateofbirth : new Date(`${req.body.dateofbirth}`).toLocaleDateString()
            }
            if(!child1.name || !child1.gender || !child1.nationality || !child1.hoppy || !child1.dateofbirth) {
                connectDB.query('SELECT * FROM children WHERE childid = ?' , [req.body.childid] , (err,children) => {
                    if(err) res.send(err)
                    res.render('update-children' , {
                        children : children,
                        message : 'املأ جميع البيانات'
                    })
                })
            }
            else {
                connectDB.query('UPDATE children SET ? WHERE childid = ?' , [child1,req.body.childid] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.body.customerid] , (err,monitors) => {
                        if(err) res.send(err)
                        connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.body.customerid] , (err,children) => {
                            if(err) res.send(err)
                            res.render('dashboard-relations' , {
                                children : children,
                                monitors : monitors,
                                message : 'تم التعديل'
                            })
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    deleteChild : (req,res) => {
        connectDB.query('DELETE FROM children WHERE childid = ?', [req.params.childid], (err, result2) => {
            if (err) res.send(err)
            connectDB.query('SELECT * FROM monitors WHERE customerid = ?' , [req.params.customerid] , (err, monitors) => {
                if (err) res.send(err)
                connectDB.query('SELECT * FROM children WHERE customerid = ?' , [req.params.customerid] , (err,children) => {
                    if(err) res.send(err)
                    res.render('dashboard-relations', {
                        monitors: monitors,
                        children : children,
                        message: 'تم الحذف'
                    })
                })
            })
        })
    },

    showDashboardOrdersPage : (req,res) => {
        let sitterOrder = 'sitter',
            nurseryOrder = 'nursery'
        connectDB.query('SELECT * FROM orders WHERE accounttype = ?' , [sitterOrder] , (err,sitterOrders) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM orders WHERE accounttype = ?' , [nurseryOrder] , (err,nurseryOrders) => {
                if(err) res.send(err)
                res.render('dashboard-orders' , {
                    sitterOrders : sitterOrders,
                    nurseryOrders : nurseryOrders
                })
            })
        })
    },

    deleteOrder : (req,res) => {
        connectDB.query('DELETE FROM orders WHERE orderid = ?' , [req.params.orderid] , (err,result) => {
            if(err) res.send(err)
            else {
                connectDB.query('DELETE FROM orderchildren WHERE orderid = ?' , [req.params.orderid] , (err,result1) => {
                    if(err) res.send(err)
                    else {
                        let sitterOrder = 'sitter',
                            nurseryOrder = 'nursery'
                        connectDB.query('SELECT * FROM orders WHERE accounttype = ?' , [sitterOrder] , (err,sitterOrders) => {
                            if(err) res.send(err)
                                connectDB.query('SELECT * FROM orders WHERE accounttype = ?' , [nurseryOrder] , (err,nurseryOrders) => {
                                    if(err) res.send(err)
                                    res.render('dashboard-orders' , {
                                        sitterOrders : sitterOrders,
                                        nurseryOrders : nurseryOrders,
                                        message : 'تم الحذف'
                                    })
                                })
                        })
                    }
                })
            }
        })
    },
    
    showDashboardPolicyPage : (req,res) => {
        connectDB.query('SELECT id,terms,phonenumber FROM haleemhinfo' , (err,info) => {
            if(err) res.send(err)
            res.render('dashboard-policy' , {
                info : info
            })
        })
    },

    showUpdatePolicyPage : (req,res) => {
        connectDB.query('SELECT id,terms,phonenumber FROM haleemhinfo WHERE id = ?' , [req.params.id] , (err,info) => {
            if(err) res.send(err)
            res.render('update-policy' , {
                info : info
            })
        })
    },

    updatePolicy : (req,res) => {
        try {
            if(!req.body.terms || !req.body.phonenumber) {
                connectDB.query('SELECT id,terms,phonenumber FROM haleemhinfo WHERE id = ?' , [req.body.id] , (err,info) => {
                    if(err) res.send(err)
                    res.render('update-policy' , {
                        info : info,
                        message : 'املا جميع البيانات'
                    })
                })
            }
            else {
                let policy = {
                    terms : req.body.terms,
                    phonenumber : req.body.phonenumber
                }
                connectDB.query('UPDATE haleemhinfo SET ? WHERE id = ?' , [policy,req.body.id] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT id,terms,phonenumber FROM haleemhinfo' , (err,info) => {
                        if(err) res.send(err)
                        res.render('dashboard-policy' , {
                            info : info,
                            message : 'تم التعديل'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showDashboardAboutPage : (req,res) => {
        connectDB.query('SELECT id,about FROM haleemhinfo' , (err,info) => {
            if(err) res.send(err)
            res.render('dashboard-about' , {
                info : info
            })
        })
    },

    showUpdateAboutPage : (req,res) => {
        connectDB.query('SELECT id,about FROM haleemhinfo WHERE id = ?' , [req.params.id] , (err,info) => {
            if(err) res.send(err)
            res.render('update-about' , {
                info : info
            })
        })
    },

    updateAbout : (req,res) => {
        try {
            if(!req.body.about) {
                connectDB.query('SELECT id,about FROM haleemhinfo WHERE id = ?' , [req.body.id] , (err,info) => {
                    if(err) res.send(err)
                    res.render('update-about' , {
                        info : info,
                        message : 'املا جميع البيانات'
                    })
                })
            }
            else {
                let about = req.body.about
                connectDB.query('UPDATE haleemhinfo SET about = ? WHERE id = ?' , [about,req.body.id] , (err,result) => {
                    if(err) res.send(err)
                    connectDB.query('SELECT id,about FROM haleemhinfo' , (err,info) => {
                        if(err) res.send(err)
                        res.render('dashboard-about' , {
                            info : info,
                            message : 'تم التعديل'
                        })
                    })
                })
            }
        } catch (error) {
            res.send(error)
        }
    }
}