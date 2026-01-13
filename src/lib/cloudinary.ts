import { rejects } from 'assert';
import { v2 as cloudinary } from 'cloudinary'
import { resolve } from 'path';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(file:Blob):Promise<string | null>=>{
   if(!file){
    return null
   }
   try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return new Promise((resolve,reject)=>{
      const uploadstream = cloudinary.uploader.upload_stream(
        {resource_type:"auto",folder:"grocery_products"},
        (error,result)=>{
              if(error){
                reject(error)
              }else{
                resolve(result?.secure_url ?? null)
              }
        }
      )
      uploadstream.end(buffer)
    })

   } catch (error) {
      console.log(error)
      return null
   }
}

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

export default uploadOnCloudinary
