var express = require("express"),
    config = require("./package.json").config,
    _ = require("underscore"),
    dgram = require;
    app = express(),
    fs = require("fs"),
    read = require("fs").readFileSync,
    write = require("fs").writeFileSync,
    exists = require("fs").existsSync,
    append = require("fs").appendFile;

app.set("views",__dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname+"/public"));

app.listen(config.port);
console.log("Listening on " + config.port);
append("log.txt","XXX Listening on port " + config.port+"\n");

if(exists('./favourites_db.json')) {
    strings = JSON.parse(read('./favourites_db.json', 'utf-8'));
}
else {
    strings = {};
}

app.get("/", function(req, res){
    res.render("index");
});
app.get("/api/favourites", function(req,res){
    res.render("json",{data:{}});
});
app.get("/progress", function(req, res){
    try{
        var favs = JSON.parse(read("./favourites.json","utf8"));
    } catch(e){
        // lol
    }
    var history = [];
    _.each(favs, function(val,key){
        if(strings[key]){
            history.push(strings[key]);
        } else {
            history.push(null);
        }
    });
    res.render("progress",{history:history});
});
app.get("/securitythroughobscurity", function(req,res){
    try{
        var favs = JSON.parse(read("./favourites.json","utf8"));
    } catch(e){
        // lol
    }
    var history = [];
    _.each(favs, function(val,key){
        var success;
        if(strings[key]){
            success = true;
        } else {
            success = false;
        }
        history.push({"headword": key, "success": success, "count": strings[key]});
    });
    res.render("overview",{data:history});
});
app.get("/history", function(req, res){
    try{
        var favs = JSON.parse(read("./favourites.json","utf8"));
    }catch(e){
        // foo
    }
    var leftover =  _.keys(favs).length-_.keys(strings).length;
    res.render("history",{history:_.keys(strings),leftover:leftover});
});

app.get("/api/favourites/:lookup", function(req, res){
    try{
    var favs = JSON.parse(read("./favourites.json","utf8"));
    var warning = read("./warning.txt","utf8");
    } catch(e){
        // do nothing
    }
    var data = {}, flag;
    if(_.has(favs,req.params.lookup)){
        data = {headword:req.params.lookup,entry:favs[req.params.lookup],count:_.size(favs)};
        if(_.has(strings, req.params.lookup)){
            strings[req.params.lookup] += 1;
            flag = " * ";
        } else {
            strings[req.params.lookup] = 1;
            flag = "***";
            data["newentry"] = true;
        }
        data["global"] = _.keys(strings).length;
        write("./favourites_db.json", JSON.stringify(strings, null, '    '));
    } else {
        flag = "   ";
    }
    if(warning){data["warning"] = warning;}
    append("log.txt",flag + " " + req.params.lookup+"\n");
    console.log(flag + " " + req.params.lookup);
    res.render("json",{data:data});
});

