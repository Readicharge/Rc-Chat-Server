
// Creating a new support ticket by the user

import Support from "../models/supportTicketModel.js";
import User from "../models/userModel.js";

const createSupportTicket = async (req, res) => {
   try{
    const {user_id,user_type,customer_name,query} = req.body;

    // Getting the list of all the customer supports which are there 
    const avail_customer_support = await User.find({user_type:"user"});

    // making the array of _id taken from tx`he avail_customer_support variable 
    const customer_support_id = avail_customer_support.map(customer_support => customer_support._id);

    // Creating the Support Ticket 
    const support_ticket = new Support({
        user_id,user_type,customer_name,query,customer_support_id
    });

    // Saving the Support Ticket
    await support_ticket.save();

    // Sending the success status 
    res.status(201).json({data:"Support Ticket Created Successfully"});
   }
   catch(error)
   {
    // Sending the Error Message 
    res.status(201).json({data:"Error in Creating Support Ticket"});
   }

}

const updateSupportTicket = async (req, res) => {
    try {
        // Getting the fields which need to be updated
        const idata = req.body;

        // Check if the request has the 'query' field
        if (req.body.query) {
            // If 'query' field exists, update the support ticket to add the query content to the array
            await Support.findByIdAndUpdate(
                req.params.id,
                { $push: { query: { $each: req.body.query } } },
                { new: true }
            );
        } else {
            // If 'query' field does not exist, update the support ticket without modifying the 'query' array
            await Support.findByIdAndUpdate(req.params.id, idata, { new: true });
        }

        // Sending the success status
        res.status(201).json({ data: "Support Ticket Updated Successfully" });
    } catch (error) {
        // Sending the error status
        res.status(500).json({ data: "Error in Updating Support Ticket" });
    }
};




// Getting the list of supprt tickets for the specific user 
const getSupportTickets = async (req, res) => {
    try{
        // Getting the user id
        const user_id = req.user._id;
        
        // Finding the list of all the support tickets for the user 
        const support_tickets = await Support.find({user_id});

        // If there are support tickets avaialable then send the support ticket as the response otherwise send an empty list
        if(support_tickets.length > 0)
        {
            res.status(200).json({data:support_tickets});
        }
        else
        {
            res.status(200).json({data:[]});
        }
    }
    catch(error)
    {
        // Sending the error status
        res.status(201).json({data:"Error in Getting Support Tickets"});
    }
}



// Getting the list of supprt tickets for the specific customer support 
const getSupportTicketsForCustomerSupport = async (req, res) => {
    // Here the customer support id will be present in the list itself 
    const customer_support_id = req.user._id;
    try{
        // Finding the list of all the support tickets for the customer support id which are present in the list 
        const support_tickets = await Support.find({customer_support_id});

        // If there are support tickets avaialable then send the support ticket as the response otherwise send an empty list
        if(support_tickets.length > 0)
        {
            res.status(200).json({data:support_tickets});
        }
        else{
            res.status(200).json({data:[]});
        }


    }
    catch(error)
    {
        // Sending the error status
        res.status(201).json({data:"Error in Getting Support Tickets"});
    }
}

export {
    createSupportTicket,
    updateSupportTicket,
    getSupportTickets,
    getSupportTicketsForCustomerSupport
}