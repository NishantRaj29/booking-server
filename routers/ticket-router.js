const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticket-controller');
const app = express();
app.use(express.json());

// Route to initialize seats (only call once to set up the DB)
router.post('/initialize', ticketController.initializeSeats);

// Route to show current seat availability
router.get('/show', ticketController.showSeats);

// Route to book seats
router.post('/book', ticketController.bookSeats);

router.patch('/update', ticketController.updateSeats);

router.post('/reset', ticketController.resetSeats);

module.exports = router;
