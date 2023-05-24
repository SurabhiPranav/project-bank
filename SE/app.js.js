// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { promisify } = require('util');
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var nodemailer = require('nodemailer');
const AdmZip = require('adm-zip');
const archiver = require('archiver');
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pranavrao',
  database: 'proma',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get('/', function (req, res) {
  res.render('log',{aresult:'',result:''})

})
var t;
const storage = multer.diskStorage({
  destination: async (req, file, cb)=> {
    username1 = req.body.username+"/"; // assuming username is sent in the request body
    const [R] = await pool.query('SELECT max(pid) as m FROM  project')
           t=R[0].m;
          t=t+1;
          username1+=t.toString();
          console.log(file)
      const uploadPath = `public/uploads/${username1}`; // create the upload path using the username
      fs.mkdirSync(uploadPath, { recursive: true }); // create the directory if it doesn't exist
      cb(null, uploadPath); // specify the directory where uploaded files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // generate a unique filename using the original file name
  }
});
const upload = multer({ storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".zip") {
      return cb(new Error("Only zip files are allowed"));
    }
    cb(null, true);
    
  } });
  const storag = multer.diskStorage({
    destination: async (req, file, cb)=> {
      try { const { sessionToken } = req.cookies;
      var decoded = jwt.verify(sessionToken, '12345678');
      console.log(decoded)
      console.log(file)
      const uploadPath = `public/uploads/${decoded.userId}`; // create the upload path using the username
      fs.mkdirSync(uploadPath, { recursive: true }); // create the directory if it doesn't exist
      cb(null, uploadPath); // specify the directory where uploaded files should be stored
}
     catch(err){
      res.redirect('/home')
     }
        
    },
    filename: async (req, file, cb) => {
      try { const { sessionToken } = req.cookies;
      var decoded = jwt.verify(sessionToken, '12345678');
      var [i]= await pool.query('select * from userlogin WHERE id = ?', [decoded.userId])
      if(i[0].pic)
      {
        var s='public'+ i[0].pic
        fs.unlink(s, (err) => {
          if (err) throw err;
          console.log('File deleted!');
        });
      }
       
      //var link=file.destination/file.originalname
      console.log(file)
      var ext=path.extname(file.originalname).toLowerCase()
      var name="IIT2021178"+ext
      var link = `/uploads/${decoded.userId}/${name}`
      await pool.query('UPDATE userlogin SET pic = ? WHERE id = ?', [link, decoded.userId]);
      cb(null, name); // generate a unique filename using the original file name

    }
    catch(err){
      res.redirect('/home')
     }

    }
  });
  const imgupload = multer({ storage: storag,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
    });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iit2021178@iiita.ac.in',
      pass: 'Pranav@c2'
    }
  });

// Login route
app.post('/user', async (req, res) => {
  //res.set('Cache-Control', 'no-store');
  var username = (req.body.username)
  var password = (req.body.password)
  // Find user by email
  const [rows] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [username]);
  console.log(rows)
  const user = rows[0];
 console.log(username+" "+password)
  // User not found
  if (!user) {
    return res.render('log',{result:'Invalid email or password',aresult:''});
  }
  console.log(username+" "+password)
  // Compare password
  
  var isMatch=false ;
   if(user.password==password){
      isMatch=true  
    };
  if (!isMatch) {
   return res.render('log', { result: "incorrect credentials", aresult: "" })
  }

  // Generate session token
  const sessionToken = jwt.sign({ userId: user.id },'12345678');
  await pool.query('UPDATE userlogin SET session_token = ? WHERE id = ?', [sessionToken, user.id]);

  // Set session token cookie
  res.cookie('sessionToken', sessionToken, { httpOnly: true });

  res.redirect('/home')
});

app.post('/admin', async (req, res) => {
  //res.set('Cache-Control', 'no-store');
  var username = (req.body.adminname)
  var password = (req.body.password)
  // Find user by email
  const [rows] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [username]);
  console.log(rows)
  const admin = rows[0];
 console.log(username+" "+password)
  // User not found
  if (!admin) {
    return res.render('log',{result:'',aresult:'Invalid email or password'});
  }
  console.log(username+" "+password)
  // Compare password
  
  var isMatch=false ;
   if(admin.password==password){
      isMatch=true  
    };
  if (!isMatch) {
   return res.render('log', { result: "", aresult: "incorrect credentials" })
  }

  // Generate session token
  const sessionToken = jwt.sign({ adminId: admin.id },'12345678');
  await pool.query('UPDATE adminlogin SET session_token = ? WHERE id = ?', [sessionToken, admin.id]);

  // Set session token cookie
  res.cookie('sessionToken', sessionToken, { httpOnly: true });

  res.redirect('/adminhome')
});

app.get("/home", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
  const [ud] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [decoded.userId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project');
  const [up] = await pool.query('SELECT * FROM userlogin natural join project WHERE id = ?', [decoded.userId]);
  value={ t1:'All',t2:'All'}
  res.render("i", { u: ud, uproject: up, oproject: op,val:value})

}
     catch(err){
      res.redirect('/')
     }
       
    
    
})

app.get("/adminhome", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
 
  const [ua] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [decoded.adminId]);
  console.log(ua)
  console.log(decoded)
  
  const [oa] = await pool.query('SELECT * FROM userlogin natural join project');
  const [Fd] = await pool.query('SELECT * FROM userlogin natural join feedback');
  
  console.log(oa)
  value={ t1:'All',t2:'All'}
 
  res.render("a", {u: ua, Feedback: Fd, oproject: oa ,val:value})

}
     catch(err){
      res.redirect('/')
     }
    
})

//profile
app.get("/profile", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
  const [ud] = await pool.query('SELECT * FROM userlogin  WHERE id = ?', [decoded.userId]);
  console.log(ud)
   
  res.render("profile", { u: ud})

}
     catch(err){
      res.redirect('/')
     }
     
    
})

app.get("/Feedback", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
  const [ud] = await pool.query('SELECT * FROM userlogin  WHERE id = ?', [decoded.userId]);
  console.log(ud)
   
  res.render("Feedback", { u: ud})

}
     catch(err){
      res.redirect('/')
     }
     
    
})

app.post("/feedback",  async (req, res) => {
  var uid = (req.body.uid)
  var message = (req.body.message)
  var rating = (req.body.rating)
  console.log(message)
  
   await pool.query('insert into feedback (id,rating,mess) values(?,?,?)', [ uid,rating,message])
  res.redirect('/home');
})


app.get("/FAQ", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
  const [ud] = await pool.query('SELECT * FROM userlogin  WHERE id = ?', [decoded.userId]);
  console.log(ud)
   
  res.render("faq", { u: ud})

}
     catch(err){
      res.redirect('/')
     }
     
    
})
app.get("/Contact", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
  const [ud] = await pool.query('SELECT * FROM userlogin  WHERE id = ?', [decoded.userId]);
  console.log(ud)
   
  res.render("contact", { u: ud})

}
     catch(err){
      res.redirect('/')
     }
     
    
})

app.post("/add", upload.single('files'), async (req, res)=> {

  res.set('Cache-Control', 'no-store');

  try { const { sessionToken } = req.cookies;
   var decoded = jwt.verify(sessionToken, '12345678');
   console.log(decoded)
    
 
 }
      catch(err){
       res.redirect('/')
      }

  var projectname = (req.body.pname)
  var projectdis = (req.body.pdis)
  var tag = (req.body.ptag)

  var id = decoded.userId
  
  console.log(req.file);
  if(req.file){
  const zip = new AdmZip(req.file.path);
zip.extractAllTo(req.file.destination, true);
  }
  pool.query('insert into project (pid,projectname, id, tag, dis) values(?,?,?,?,?)', [t,projectname, id, tag, projectdis]
  )
  res.redirect('/home');
})

app.get("/tag", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

  var dep = (req.query.D)
  var topic= (req.query.T)
  console.log(dep)
  console.log(topic)

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
 
  if(dep=='All' && topic=='All'){
  const [ud] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [decoded.userId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project');
  const [up] = await pool.query('SELECT * FROM userlogin natural join project WHERE id = ?', [decoded.userId]);
  console.log('1')
  value={ t1:'All',t2:'All'}
  res.render("i", { u: ud, uproject: up, oproject: op,val:value})
}
else  if(dep==='All' && topic!=='All'){
  const [ud] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [decoded.userId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where tag=?', [topic]);
  const [up] = await pool.query('SELECT * FROM userlogin natural join project WHERE id = ?', [decoded.userId]);
  console.log('2')
  value={ t1:'All',t2:topic}
  res.render("i", { u: ud, uproject: up, oproject: op,val:value})
  res.render("i", { u: ud, uproject: up, oproject: op })
}
else  if(dep!=='All' && topic==='All'){
  const [ud] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [decoded.userId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where dept=?', [dep]);
  const [up] = await pool.query('SELECT * FROM userlogin natural join project WHERE id = ?', [decoded.userId]);
  console.log('3')
  value={ t1:dep,t2:'All'}
  res.render("i", { u: ud, uproject: up, oproject: op,val:value})
}
else  {
  const [ud] = await pool.query('SELECT * FROM userlogin WHERE id = ?', [decoded.userId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where tag=? and dept=?', [topic,dep]);
  const [up] = await pool.query('SELECT * FROM userlogin natural join project WHERE id = ?', [decoded.userId]);
  console.log('4')
  value={ t1:dep,t2:topic}
  res.render("i", { u: ud, uproject: up, oproject: op,val:value})
}

}
     catch(err){
      res.redirect('/')
     }
       
    
    
})
app.get("/atag", async (req, res) =>{
  res.set('Cache-Control', 'no-store');

  var dep = (req.query.D)
  var topic= (req.query.T)
  console.log(dep)
  console.log(topic)

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
  console.log(decoded)
 
  if(dep=='All' && topic=='All'){
  const [ud] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [decoded.adminId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project');
  const [Fd] = await pool.query('SELECT * FROM userlogin natural join feedback');
  
  value={ t1:'All',t2:'All'}
  res.render("a", { u: ud, oproject: op,Feedback: Fd, val:value})
}
else  if(dep==='All' && topic!=='All'){
  const [ud] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [decoded.adminId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where tag=?', [topic]);
  const [Fd] = await pool.query('SELECT * FROM userlogin natural join feedback');
  console.log('2')
  value={ t1:'All',t2:topic}
  res.render("a", { u: ud, oproject: op,Feedback: Fd, val:value})
  
}
else  if(dep!=='All' && topic==='All'){
  const [ud] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [decoded.adminId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where dept=?', [dep]);
  const [Fd] = await pool.query('SELECT * FROM userlogin natural join feedback');
  console.log('3')
  value={ t1:dep,t2:'All'}
  res.render("a", { u: ud, oproject: op,Feedback: Fd, val:value})
}
else  {
  const [ud] = await pool.query('SELECT * FROM adminlogin WHERE id = ?', [decoded.adminId]);
  const [op] = await pool.query('SELECT * FROM userlogin natural join project where tag=? and dept=?', [topic,dep]);
  const [Fd] = await pool.query('SELECT * FROM userlogin natural join feedback');
  console.log('4')
  value={ t1:dep,t2:topic}
  res.render("a", { u: ud, oproject: op,Feedback: Fd, val:value})
}

}
     catch(err){
      res.redirect('/')
     }
       
    
    
})

app.post("/addstudent",  async (req, res)=> {
  var studentname = (req.body.sname)
  var sid = (req.body.sid)
  var number = (req.body.snumber)
  var dept= (req.body.dept)
  var email = (req.body.semail)
  var password =(req.body.spassword)
  console.log(sid)
   await pool.query('insert into userlogin (username,id,phonenumber,email, password,dept) values(?,?,?,?,?,?)', [studentname,sid, number,email,password,dept])
  res.redirect('/adminhome');
})

app.post("/show", async (req, res)=> {

  try { const { sessionToken } = req.cookies;
   var decoded = jwt.verify(sessionToken, '12345678');
   console.log(decoded)
    
 

      

  var proids = "public"+"/"+"uploads"+"/"+(req.body.proid)
  const [ud] = await pool.query('SELECT * FROM userlogin  WHERE id = ?', [decoded.userId]);
  console.log(proids)
  fs.stat( proids, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
  
    if (stats.isFile()) {
        var t="uploads"+"/"+(req.body.proid)
        res.render("shw", {u:ud, p:t,q:''})
    } else if (stats.isDirectory()) {
        
     fs.readdir(proids, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log(files);
      for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]).toLowerCase()==".zip") {
            var spliced = files.splice(i, 1);
            console.log("Removed element: " + spliced);
            console.log("Remaining elements: " + files);
        }
    }
      res.render("shw1", { u:ud,file:files,prolink:(req.body.proid)})
    }
  });
 
    } else {
      console.log('The path is neither a file nor a directory');
    }
  });
}
  catch(err){
    res.redirect('/')
   }
 
})
app.post("/ashow", async (req, res)=> {

  try { const { sessionToken } = req.cookies;
   var decoded = jwt.verify(sessionToken, '12345678');
   console.log(decoded)
    
 

      

  var proids = "public"+"/"+"uploads"+"/"+(req.body.proid)
  const [ud] = await pool.query('SELECT * FROM adminlogin  WHERE id = ?', [decoded.adminId]);
  console.log(proids)
  fs.stat( proids, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
  
    if (stats.isFile()) {
        var t="uploads"+"/"+(req.body.proid)
        res.render("ashw", {u:ud, p:t,q:''})
    } else if (stats.isDirectory()) {
        
     fs.readdir(proids, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log(files);
      for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]).toLowerCase()==".zip") {
            var spliced = files.splice(i, 1);
            console.log("Removed element: " + spliced);
            console.log("Remaining elements: " + files);
        }
    }
      res.render("ashw1", { u:ud,file:files,prolink:(req.body.proid),q:''})
    }
  });
 
    } else {
      console.log('The path is neither a file nor a directory');
    }
  });
}
  catch(err){
    res.redirect('/')
   }
 
})
app.post("/Feedback",  async (req, res)=> {
  var uid = (req.body.uid)
  var message = (req.body.message)
  var rating = (req.body.rating)
  await pool.query('insert into feedback (id,rating,mess) values(?,?,?)', [ uid,rating,message]) 
  res.redirect('/home');
})
app.post('/download',async (req, res)=> {
  var link ="public"+"/"+"uploads"+"/"+req.body.dlink
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.directory(link, false);
   console.log(link)
   var filename=req.body.pname+'.zip'
  res.attachment(filename);
  archive.pipe(res);
  archive.finalize();
 
});

app.post("/delete", async (req, res)=> {
  var proid = (req.body.proid)
  var name=(req.body.name)
  console.log(name)
  console.log(proid)
   await pool.query('delete from project where project.pid=?', [proid])
  var path='public/uploads/'+name+'/'+proid
fs.rmdir(path, { recursive: true }, (err) => {
  if (err) throw err;
  console.log('File deleted!');
});

 res.redirect('/home');
})
app.post("/adelete", async (req, res)=> {
  var proid = (req.body.proid)
  var name=(req.body.name)
  console.log(name)
  console.log(proid)
   await pool.query('delete from project where project.pid=?', [proid])
  var path='public/uploads/'+name+'/'+proid
fs.rmdir(path, { recursive: true }, (err) => {
  if (err) throw err;
  console.log('File deleted!');
});

 res.redirect('/adminhome');
})

app.post("/forget",async (req, res)=>{
  res.sendFile(__dirname + "/otp.html")
})
app.post("/forgotpassword", function (req, res) {
  username = (req.body.aname)
 res.redirect("/otp")
})
app.post("/reset",async (req, res)=>{
  var pass=req.body.newpasword
  pool.query('update userlogin set password=? where id=?', [pass,username])
 res.redirect("/")
})

app.post("/editProfile",imgupload.single('files'), async (req, res) =>{
  res.set('Cache-Control', 'no-store');

 try { const { sessionToken } = req.cookies;
  var decoded = jwt.verify(sessionToken, '12345678');
 
  console.log(req.file);
//  if(req.file.destination)
  console.log()
 await pool.query('UPDATE userlogin SET address=?,about=?,city=?,phonenumber=?,twitterlink=?,Facebooklink=?,githublink=?,linkedinlink=?  WHERE id = ?', [ req.body.address, req.body.about, req.body.city, req.body.Phone, req.body.twitter, req.body.facebook, req.body.github, req.body.linkedin,decoded.userId]);
  res.redirect("/profile")

}
     catch(err){
      res.redirect('/')
     }
       
    
    
})

// Logout route
app.get('/logout', async (req, res) => {
  const { sessionToken } = req.cookies;
  // Verify session token
  try {
    var decoded = jwt.verify(sessionToken, '12345678');
    const userId = decoded.userId;
    // Clear session token
    await pool.query('UPDATE userlogin SET session_token = NULL WHERE id = ?', [userId]);
    console.log(decoded)
    // Clear session token cookie
    res.clearCookie('sessionToken');
    // Redirect to / page
    res.redirect('/');
  } catch (err) {
   
    res.status(401).send('Unauthorized');
  }
});
app.get('/alogout', async (req, res) => {
  const { sessionToken } = req.cookies;
  // Verify session token
  try {
    var decoded = jwt.verify(sessionToken, '12345678');
    const userId = decoded.adminId;
    // Clear session token
    await pool.query('UPDATE adminlogin SET session_token = NULL WHERE id = ?', [userId]);
    console.log(decoded)
    // Clear session token cookie
    res.clearCookie('sessionToken');
    // Redirect to / page
    res.redirect('/');
  } catch (err) {
   
    res.status(401).send('Unauthorized');
  }
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});