const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


module.exports = {
    uploadImage: async (file, callBack) => {
        const options = { resource_type: 'image', folder: 'year-book/users/' };
        return await cloudinary.uploader.upload(file, options, callBack);
    },
}
