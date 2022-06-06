const cloudinary=require('cloudinary').v2
const dotenv =require('dotenv')
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: folder
        }, (err,result) => {
            if(err){
                err.statusCode=500
                next(err)
            }
            resolve({
                url: result.url,
                id: result.public_id
            })
            //console.log(result)
        })
    })
}