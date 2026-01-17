        import mongoose from "mongoose";


        interface IUser{
            _id?:mongoose.Types.ObjectId
            socketId:string | null
            isOnline:boolean
            email:string,
            name:string,
            password?: string,
            mobile?:string
            role?:"user" | 'admin' | 'deliveryBoy',
            image?:string,
            location: {
                type: {
                    type: string;
                    enum: string[];
                    default: string;
                };
                coordinates: {
                    type: number[];
                    default: number[];
                };
}
        }

        const userSchema = new mongoose.Schema<IUser>({
        socketId:{
            type:String,
            default:null
        },
        isOnline:{
            type:Boolean,
            default:false
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password:{
            type:String,
            required:false
        },
        mobile:{
            type:String,
            required:false
        },
        role:{
            type:String,
             enum: ["user","admin","deliveryBoy"],
            default:"user"
        },
        image:{
            type:String
        },
        location:{
            type:{
                type:String,
                enum:['Point'],
                default:"Point"
            },
            coordinates:{
                type:[Number],
                default:[0,0]
            }
        }
        },{timestamps:true})

        userSchema.index({location:"2dsphere"})

        const User = mongoose.models.User || mongoose.model('User',userSchema)

        export default User