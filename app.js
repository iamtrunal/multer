const express = require ("express");
const multer = require ("multer");
const ejs = require ("ejs");
const path = require("path");

const port = 3000;

//set  storage engine
const storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename : function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + 
        path.extname(file.originalname));
    }
});

//init uploads
const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:function(req , file , cb){
        checkFileType(file , cb);
    }
}).single('myImage');

//check file type
function checkFileType(file , cb){
    //allow extension
    const filetypes = /jpeg|jpg|png|gif/;
    //check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype); 

    if(mimetype && extname){
        return cb(null , true);
    }else{
        cb("Error :Images only");
    }
}



//init app
const app = express();

//ejs
app.set("view engine" , "ejs");

//public folder
app.use(express.static("./public"));

app.get("/" , (req,res) => res.render('index') );

app.post("/uploads" , (req,res) => {
    upload(req ,res , (err) => {
     if(err){
        res.render("index" , {
            msg:err
        });
     }else {
        // console.log(req.file);
        // res.send("test");
        if(req.file == undefined){
            res.render("index" , {
            msg:"Error no file selected"
            });
        }else{
            res.render("index" , {
                msg: "file uploaded",
                file:`uploads/${req.file.filename}`
            });
        }
     }
    }); 
});

app.listen (port , () => {
    console.log(`Server Running At PORT :- ${port}`)
} );