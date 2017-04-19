var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

//-------------------------------------------------------//
// USE SECTION
//-------------------------------------------------------//
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
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

app.get("/blogs",function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      throw(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.get("/blogs/new",function(req,res){
  res.render("new");
});

app.post("/blogs",function(req,res){
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var created = req.body.created;
  var newBlog = {title: title, image: image, body: body, created: created};
  Blog.create({newBlog},function(err, blog){
    if(err){
      throw(err);
    } else{
      console.log(blog);
    }
  });
  res.redirect("index");
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
