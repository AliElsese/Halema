const express = require('express');
const route = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , './server/uploads')
    },

    filename : (req , file , cb) => {
        cb(null , file.originalname)
    }
})
const upload = multer({ storage : storage })

// MiddleWares
const {verifyAdmin} = require('./middleware')

// Controllers
const sitterController = require('../controllers/sitter-controller')
const customerController = require('../controllers/customer-controller')

// Services
const dashboardRender = require('../services/dashboard-render')
const mainRender      = require('../services/main-render')

// Main Render
route.get('/about-us-page' , mainRender.showAboutPage)
route.get('/contact-us-page' , mainRender.showContactPage)
route.get('/privacy-page' , mainRender.showPrivacyPage)

route.get('/api-countriesCodes' , sitterController.countriesCodes)

// Api Sitters
route.post('/api-registerNewAccount' , sitterController.registerNewAccount)
route.post('/api-updateToken' , sitterController.updateToken)
route.post('/api-addPapers' , upload.fields([{name : 'lease' , maxCount : 1} , {name : 'residencephoto' , maxCount : 1} , {name : 'personalpicture' , maxCount : 1} , {name : 'commercialrefister' , maxCount : 1} , {name : 'taxnumber' , maxCount : 1} , {name : 'experiencecertificates'}]) , sitterController.addPapers)
route.post('/api-loginAccount' , sitterController.loginAccount)
route.post('/api-getInfo' , sitterController.getInfo)
route.post('/api-updateInfo' , upload.single('userimage') , (sitterController.updateInfo))
route.post('/api-addRoom' , upload.single('roomimage') , sitterController.addRoom)
route.delete('/api-removeRoom' , sitterController.removeRoom)
route.post('/api-currentOrders2' , sitterController.currentOrders)
route.post('/api-previousOrders2' , sitterController.previousOrders)
route.post('/api-forgetPassword2' , sitterController.forgetPassword)
route.post('/api-resetPassword2' , sitterController.resetPassword)
route.post('/api-confirmOrder' , sitterController.confirmOrder)
// chat
route.post('/api-sendMessage2' , sitterController.sendMessage)
route.post('/api-showAllChats2' , sitterController.showAllChats)
route.post('/api-showChat2' , sitterController.showChat)
// notification
route.post('/api-userNotifications' , sitterController.getAllNotifications)

// Api Customer
route.post('/api-registerCustomer' , customerController.registerCustomer)
route.post('/api-loginCustomer' , customerController.loginCustomer)
route.post('/api-updateToken2' , customerController.updateToken)
route.get('/api-sliderShow' , customerController.sliderShow)
route.post('/api-getSitters' , customerController.getSitters)
route.post('/api-getSitterInfo' , customerController.getSitterInfo)
route.post('/api-getNursries' , customerController.getNursries)
route.post('/api-favouriteAction' , customerController.favouritesAction)
route.post('/api-getFavourites' , customerController.getFavourites)
route.post('/api-showRatesList' , customerController.ratesList)
route.post('/api-sendRate' , customerController.sendRate)
route.post('/api-sendOrder' , customerController.sendOrder)
route.post('/api-currentOrders' , customerController.currentOrders)
route.post('/api-previousOrders' , customerController.previousOrders)
route.post('/api-getCustomerInfo' , customerController.getCustomerInfo)
route.post('/api-updateCustomer' , upload.single('userimage') , customerController.updateInfo)
route.post('/api-allCustomerChildren' , customerController.getAllChildren)
route.post('/api-addCustomerChild' , customerController.addChild)
route.delete('/api-removeCustomerChild' , customerController.removeChild)
route.post('/api-allCustomerMonitors' , customerController.getAllMonitors)
route.post('/api-addCustomerMonitor' , customerController.addMonitor)
route.delete('/api-removeCustomerMonitor' , customerController.removeMonitor)
route.get('/api-aboutus' , customerController.aboutusText)
route.get('/api-terms' , customerController.termsText)
route.post('/api-forgetPassword' , customerController.forgetPassword)
route.post('/api-resetPassword' , customerController.resetPassword)
route.post('/api-orderPaid' , customerController.orderPaid)
// chat
route.post('/api-sendMessage' , customerController.sendMessage)
route.post('/api-showAllChats' , customerController.showAllChats)
route.post('/api-showChat' , customerController.showChat)
// notifications 
route.post('/api-customerNotifications' , customerController.getAllNotifications)

// Dashboard Render
route.get('/login-admin' , dashboardRender.showLoginPage)
route.post('/api-loginAdmin' , dashboardRender.loginAdmin)
route.get('/dashboard' , dashboardRender.showDashboardPage)
route.get('/dashboard-sitters' , dashboardRender.showDashboardSittersPage)
route.get('/add-sitter' , dashboardRender.showAddSitterPage)
route.post('/api-addSitter' , dashboardRender.addSitter)
route.get('/update-sitter/:sitterid' , dashboardRender.showUpdateSitterPage)
route.post('/api-updateSitter' , dashboardRender.updateSitter)
route.get('/api-deleteSitter/:sitterid' , dashboardRender.deleteSitter)
// route.get('/sitterPapers/:sitterid' , dashboardRender.showSitterPapersPage)
route.get('/dashboard-nurseries' , dashboardRender.showDashboardNurseriesPage)
route.get('/add-nursery' , dashboardRender.showAddNurseryPage)
route.post('/api-addNursery' , dashboardRender.addNursery)
route.get('/update-nursery/:nurseryid' , dashboardRender.showUpdateNurseryPage)
route.post('/api-updateNursery' , dashboardRender.updateNursery)
route.get('/api-deleteNursery/:nurseryid' , dashboardRender.deleteNursery)
// route.get('/nurseryPapers/:nurseryid' , dashboardRender.showNurseryPapersPage)
route.get('/dashboard-customers' , dashboardRender.showDashboardCustomersPage)
route.get('/add-customer' , dashboardRender.showAddCustomerPage)
route.post('/api-addCustomer' , dashboardRender.addCustomer)
route.get('/update-customer/:customerid' , dashboardRender.showUpdateCustomerPage)
route.post('/api-updateCustomer2' , dashboardRender.updateCustomer)
route.get('/api-deleteCustomer/:customerid' , dashboardRender.deleteCustomer)
route.get('/customerRelations/:customerid' , dashboardRender.showDashboardCustomerRelationsPage)
route.get('/add-monitor/:customerid' , dashboardRender.showAddMonitorPage)
route.post('/api-addMonitor' , dashboardRender.addMonitor)
route.get('/update-monitor/:monitorid' , dashboardRender.showUpdateMonitorPage)
route.post('/api-updateMonitor' , dashboardRender.updateMonitor)
route.get('/api-deleteMonitor/:monitorid/:customerid' , dashboardRender.deleteMonitor)
route.get('/add-child/:customerid' , dashboardRender.showAddChildrenPage)
route.post('/api-addChildren' , dashboardRender.addChildren)
route.get('/update-children/:childid' , dashboardRender.showUpdateChildrenPage)
route.post('/api-updatechildren' , dashboardRender.updateChildren)
route.get('/api-deleteChild/:childid/:customerid' , dashboardRender.deleteChild)
route.get('/dashboard-orders' , dashboardRender.showDashboardOrdersPage)
route.get('/api-deleteOrder/:orderid' , dashboardRender.deleteOrder)
route.get('/dashboard-policy' , dashboardRender.showDashboardPolicyPage)
route.get('/update-policy/:id' , dashboardRender.showUpdatePolicyPage)
route.post('/api-updatePolicy' , dashboardRender.updatePolicy)
route.get('/dashboard-about' , dashboardRender.showDashboardAboutPage)
route.get('/update-about/:id' , dashboardRender.showUpdateAboutPage)
route.post('/api-updateAbout' , dashboardRender.updateAbout)

module.exports = route