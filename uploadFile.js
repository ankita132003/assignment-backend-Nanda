import cloudinary from "cloudinary";


// Configuration 
cloudinary.config({
  cloud_name: "ame",
  api_key: "key",
  api_secret: "secret"
});

const opts ={
    overwrite: true,
    invaidate: true,
    resource_type: "auto",
}


module.exports = (resumeURL)=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload(resumeURL, opts,(err, result)=>{
            if(result && result.secure.url){
                console.log(result.secure_url)
                return resolve(result.secure_url);
            }
            console.log(err.message);
            return reject({ message: err.message});
        })
    })
}
