import mongoose from "mongoose";

const supportTicketSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    customer_support_id:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true
    },
    user_type:{
        type:String,
        required:true,
        enums:["installer","customer","company","affiliate","none"],
        default:"none"
    },
    customer_name:{
        type:String,
        required:true
    },
    query:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enums:["open","processing","closed"],
        default:"open"
    },
    ticket_taken_by:{
        type:mongoose.Schema.Types.ObjectId
    }
},{
    timestamps: true,
}
);

const Support = mongoose.model("SupportTicket", supportTicketSchema);

export default Support;