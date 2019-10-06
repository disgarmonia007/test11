var mongoose = require('mongoose');
var log = require('./log')(module);

mongoose.connect('mongodb://localhost:27017/test1',{useNewUrlParser: true,useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error',(err)=>{
log.error('connection error',err.message);
});
db.once('open',function callback(){
log.info("Connected to DB!");
});
var Schema = mongoose.Schema;

var Images=new Schema({
kind:{
    type:String,
    enum:['thumbail','detail'],
    required:true},
    url:{type:String,required:true}
});
var Article = new Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    description:{type:String,required:true},
    images:[Images],
    modified:{type:Date,default:Date.now}
});
Article.path('title').validate((v)=>{
return v.length>5 && v.length<70; 
});
var ArticleModel=mongoose.model('Article',Article);
module.exports.ArticleModel = ArticleModel;