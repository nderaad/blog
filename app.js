var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

//-------------------------------------------------------//
// USE SECTION
//-------------------------------------------------------//
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); //tell app that whenever it sees _method, treat this as a method override
app.use(expressSanitizer()); // this sanitizes html entries so people cannot enter malicious code into your textarea forms -- must go after body-parser
//-------------------------------------------------------//
// MONGOOSE / MONGODB SECTION
//-------------------------------------------------------//
var creds = {
  uname: "admin",
  pword: "root"
}
mongoose.connect("mongodb://" + creds.uname + ":" + creds.pword + "@ds061506.mlab.com:61506/blog");

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//-------------------------------------------------------//
// RESTFUL ROUTES SECTION
//-------------------------------------------------------//
// TEST CREATE TO BE DELETED
// Blog.create({
//   title:"Test Blog",
//   image: "http://img-aws.ehowcdn.com/600x600p/photos.demandstudios.com/getty/article/251/128/87527328.jpg",
//   body: "This husky is so cool, I want one with blue eyes just like that and white fur. I will name him Tyga"
// });

app.get("/",function(req,res){
  res.redirect("/blogs");
});

///==================================================///
// INDEX
///==================================================///

app.get("/blogs",function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      throw(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

///==================================================///
// NEW
///==================================================///

app.get("/blogs/new",function(req,res){
  res.render("new");
});

///==================================================///
// CREATE
///==================================================///
app.post("/blogs",function(req,res){
  //the below line sanitizes whatever the user inputs into
  // the body (i.e. removes malicious code) which is important
  // since we're using "<%-" for the text body
  req.body.blog.body = req.sanitize(req.body.blog.body)
  // Because we set name of each input to 'blog[something]' req.body.blog
  // will pull all of the inputs w/name starting w/blog
  Blog.create(req.body.blog,function(err, blog){
    if(err){
      throw(err);
    } else{
      console.log(blog);
    }
  });
  res.redirect("/blogs");
});

///==================================================///
// SHOW
///==================================================///
app.get("/blogs/:id", function(req,res){
  Blog.findById({_id:req.params.id}, function(err,blog){
    if(err){
      throw(err);
    } else {
      res.render("show",{blog:blog});
    }
  });
});

///==================================================///
// EDIT
///==================================================///
app.get("/blogs/:id/edit", function(req,res){
  Blog.findById({_id:req.params.id}, function(err,blog){
    if(err){
      throw(err);
    } else {
      res.render("edit",{blog:blog});
    }
  });
});

///==================================================///
// UPDATE
///==================================================///
app.put("/blogs/:id", function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if(err){
      throw(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

///==================================================///
// DESTROY
///==================================================///
app.delete("/blogs/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      throw(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

///==================================================///
// PORT
///==================================================///
app.listen(3000, function(){
  console.log("Listening on port 3000");
});
