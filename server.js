var express = require("express"),
    config = require("./package.json").config,
    _ = require("underscore"),
    dgram = require;
    app = express(),
    read = require("fs").readFileSync,
    strings = {};

app.set("views",__dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname+"/public"));

app.listen(config.port);
console.log("Listening on " + config.port);

app.get("/", function(req, res){
    res.render("index");
});
app.get("/api/favourites", function(req,res){
    res.render("json",{data:{}});
});
app.get("/history", function(req, res){
    try{
        var favs = JSON.parse(read("./favourites.json","utf8"));
    }catch(e){
        // foo
    }
    var leftover =  _.size(favs)-_.size(strings);
    res.render("history",{history:strings,leftover:leftover});
});

app.get("/api/favourites/:lookup", function(req, res){
    try{
    var favs = JSON.parse(read("./favourites.json","utf8"));
    } catch(e){
        // do nothing
    }
    var data = {};
    if(_.has(favs,req.params.lookup)){
        data = {headword:req.params.lookup,entry:favs[req.params.lookup],count:_.size(favs)};
        if(strings[req.params.lookup]){
            strings[req.params.lookup] += 1;
            console.log(" *  " + req.params.lookup);
        } else {
            strings[req.params.lookup] = 1;
            console.log("*** " + req.params.lookup);
            data["newentry"] = true;
        }
        data["global"] = _.size(strings);
    } else {
        console.log("    "+ req.params.lookup);
    }
    res.render("json",{data:data});
});
