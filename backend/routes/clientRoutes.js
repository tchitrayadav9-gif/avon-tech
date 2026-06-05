const express = require('express');
const router = express.Router();
const { getClients, getClientById, createClient, updateClient, deleteClient, addCommunicationNote } = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

router.post('/:id/notes', addCommunicationNote);

module.exports = router;
