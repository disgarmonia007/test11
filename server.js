var express= require('express');
var config = require('./libs/config');
var app=express();

var log = require('./libs/log') (module);
var path=require('path');
app.use(express.favicon()); 
app.use(express.logger('dev')); 
app.use(express.bodyParser()); 
app.use(express.methodOverride()); 
app.use(app.router); 
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
    });
     
    app.use(function(err, req, res, next){ 
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message); res.send({ error: err.message });
         return;
    });
    
    app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
    });
    
var ArticleModel=require('./libs/mongoose').ArticleModel;
app.get('/api',function (req,res){
    res.send('API is running');
});

var log = require('./libs/log')(module);
app.get('/ErrorExample',function(req,res,next){
next(new Error('Random error!'));
});

app.get('/api/articles',(req,res)=>{
return ArticleModel.find((err,articles)=>{
if(!err){
    return res.send(articles);
}
else{
    res.statusCode=500;
    log.error('Internal error(%d):%s',res.statusCode,err.message);
    return res.send({error:'Server error'});
}
});
});

app.post('/api/articles',(req,res)=>{
   var article = new ArticleModel({
       title:req.body.title,
       author:req.body.author,
       description:req.body.description,
       images:req.body.images
   });
   article.save((err)=>{
if(!err){
    log.info("article created");
    return res.send({
status:'Ok',
article:article
    });
} else{
    console.log(err);
    if(err.name== 'ValidationError'){
        res.statusCode = 400;
        res.send({
            error:'Validation error'
        });
    } else {
        res.statusCode=500;
        res.send({error:'Server error'});
    }
    log.error('Internal error (%d): %s',res.statusCode,err.message);
}
   });
});

app.get('/api/articles/:id', function(req, res) {
return ArticleModel.findById(req.params.id, function (err, article) {
if(!article) { 
res.statusCode = 404;
return res.send({ error: 'Not found' });
}  
if (!err) {
return res.send({ status: 'OK', article:article }); 
} else {
    res.statusCode = 500;
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    return res.send({ error: 'Server error' }); 
    }  
    });  
})

app.put('/api/articles/:id', function (req, res){
return ArticleModel.findById(req.params.id, function (err, article) {
if(!article) {
 res.statusCode = 404;
return res.send({ error: 'Not found' });
}   
article.title = req.body.title;
article.description = req.body.description;
article.author = req.body.author;
article.images = req.body.images;
return article.save(function (err) {
if (!err) { 
log.info("article updated");
return res.send({ status: 'OK', article:article });
} else { 
if(err.name == 'ValidationError')
 {  res.statusCode = 400;
 res.send({ error: 'Validation error' });
} else {  res.statusCode = 500;
res.send({ error: 'Server error' });
}
log.error('Internal error(%d): %s', res.statusCode,err.message);
 }
 }); 
});
 }); 
 
app.delete('/api/articles/:id', function (req, res){
return ArticleModel.findById(req.params.id, function (err, article) {
if(!article) {
    res.statusCode = 404;
       return res.send({ error: 'Not found' });
               }  return article.remove(function (err) {
            if (!err) {  log.info("article removed");
                              return res.send({ status: 'OK' });
                   } else {
res.statusCode = 500;
 log.error('Internal error(%d): %s', res.statusCode,err.message);
 return res.send({ error: 'Server error' });    
   }    
 });   
 });  
}); 

app.listen(config.get('port'),()=>{
    log.info('Express server listeneng on port' + config.get('port'));
    });