const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket, addComment } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(authorize('client'), createTicket);

router.route('/:id')
  .put(authorize('admin', 'employee'), updateTicket);

router.post('/:id/comments', addComment);

module.exports = router;
