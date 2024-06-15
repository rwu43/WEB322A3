/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Ruolin Wu Student ID: 119731230 Date: Jun 14, 2024
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

const legoData = require("./modules/legoSets");
legoData.initialize();

const path = require('path');

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));



// home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
})


app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.send(set);
  }catch(err){
    res.status(404).send(err);
  }
});

app.get("/lego/sets", async (req,res)=>{
  console.log("sets");
  console.log(req.query.theme);

  try{
    if(req.query.theme){
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.send(sets);
    } else {
      let sets = await legoData.getAllSets();
      res.send(sets);
    }
  }catch(err){
    res.status(404).send(err);
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
})


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});
