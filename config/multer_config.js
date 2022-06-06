const path=require('path')
const multer =require('multer')


module.exports=multer({
  storage :multer.diskStorage({}), //use this ->for path of image
  fileFilter :(req, file, cb)=>{
    const ext=path.extname(file.originalname)
  if(ext!=='.jpg'&&ext!=='.jpeg'&&ext!=='.png'){
    cb(new Error('File format not supported'), false)
    return
  }
      cb(null,true)
  }
  })