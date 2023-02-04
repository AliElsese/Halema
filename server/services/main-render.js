const connectDB = require("../database/connection");

module.exports = {
    showAboutPage : (req,res) => {
        connectDB.query('SELECT about FROM haleemhinfo' , (err,info) => {
            if(err) res.send(err)
            res.render('about-us' , {
                about : info[0].about
            })
        })
    },

    showContactPage : (req,res) => {
        res.render('contact-us')
    },

    showPrivacyPage : (req,res) => {
        connectDB.query('SELECT terms FROM haleemhinfo' , (err,info) => {
            if(err) res.send(err)
            res.render('privacy' , {
                privacy : info[0].about
            })
        })
    }
}