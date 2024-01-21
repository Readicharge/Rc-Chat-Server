import express from "express";
const router = express.Router();
import {
  createSupportTicket,
  updateSupportTicket,
  getSupportTickets,
  getSupportTicketsForCustomerSupport
} from '../controllers/supportTicketSchema.js';
import protectRoute from "../middlewares/protectRoute.js";

// Route to create a new support ticket
router.post('/support-ticket', createSupportTicket);

// Route to update a support ticket by ID
router.put('/support-ticket/:id', updateSupportTicket);

// Route to get all support tickets for a specific user
router.get('/support-tickets',protectRoute, getSupportTickets);

// Route to get all support tickets for a specific customer support
router.get('/support-tickets-for-customer-support',protectRoute, getSupportTicketsForCustomerSupport);

export default router;
