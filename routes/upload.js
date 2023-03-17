const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const fs = require('fs');

// we will upload image ob loudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECTER_KEY
})

// Upload image only admin can use
router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No file were uploaded'});

        const file = req.files.file;
        if(file.size > 3*1024*1024){
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'Size to large from 3mb'});
        }

        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png"){
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg: 'File format is incorrect (only .jpg or .png)'});
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async (err, result) => {
            if(err) throw err;
            removeTmp(file.tempFilePath);
            res.json({public_id: result.public_id, url: result.secure_url})
        })
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// Delete image only admin can use
router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: "No image selected"});
        cloudinary.v2.uploader.destroy(public_id, (err, result) => {
            if(err) throw err;
            res.json({msg: "Deleted image"});
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

module.exports = router;