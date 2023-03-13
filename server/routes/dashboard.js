const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const DashController = require('../controllers/dashbordController');

router.get('/dashboard',isLoggedIn,DashController.dashboard)
router.get('/dashboard/item/:id',isLoggedIn,DashController.dashboardViewNote)
 router.put('/dashboard/item/:id',isLoggedIn,DashController.dashboardUpdateNote)
 router.delete('/dashboard/item-delete/:id',isLoggedIn,DashController.dashboardDeleteNote)
router.get('/dashboard/add',isLoggedIn,DashController.dashboardAddNote);
router.post('/dashboard/add',isLoggedIn,DashController.dashboardAddNoteSubmit);
router.get('/dashboard/search', isLoggedIn, DashController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, DashController.dashboardSearchSubmit);




module.exports = router;