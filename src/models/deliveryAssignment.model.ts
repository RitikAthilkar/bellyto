import mongoose from "mongoose";

interface IAssignment{
    _id?:mongoose.Types.ObjectId
    order:mongoose.Types.ObjectId,
    brodcastedTo:mongoose.Types.ObjectId[],
    assignedTo:mongoose.Types.ObjectId | null,
    status : "brodcasted" | 'assigned' | 'completed',
    acceptedAt: Date,
    createdAt?:Date,
    updatedAt?:Date
}

const AssignmentSchema = new mongoose.Schema<IAssignment>({
  order:{
    type:mongoose.Types.ObjectId,
    ref:"Order"
  },
  brodcastedTo:[{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }],
 assignedTo:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
 status:{
    type:String,
    enum:["brodcasted" , 'assigned' , 'completed']
  },
  acceptedAt:{
    type:Date
  }

},{timestamps:true})

const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment", AssignmentSchema)

export default DeliveryAssignment