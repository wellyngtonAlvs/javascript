'use strict';

module.exports = function (app) {

	//Using multer for file upload
	let multer = require('multer');

	/* 
	* Pointing the folder we want to save the files
	* I am using ./src only, because in app.js file, in line 24, we point to node consider the folder src static
	*/
	let upload = multer({dest:'./src/temp'});

	//FileStreaming LIb
	let fs = require("fs");

	//Database connector
	let db = require('../server/models');

	//Route Example
	
	//Getting the page for multiples upload example
	app.get('/files/',function(req, res) {
	  	res.render('multFiles');
	});

	//Getting the page for single upload example
	app.get('/file/',function(req, res) {
	  	res.render('file');
	});

	//Getting all images from database and transforming them back to file in src/temp folder
	app.get('/gallery/',function(req, res) {
		db.fileExample.findAll().then(function(results) {
		    if (results) {
		        //Loop in the result array
		        results.forEach(function (item){
		          try{
		              base64_decode(item.file,item.fileName);
		          }catch (e){
		            console.log(e+' Erro ao criar o documento');
		          }
		        });//End of forEach
     		     res.render('gallery',{files: results});
		    } else {
		    	res.send(404);
		    }
		 },function (error) {
		    console.log(error);
		     res.sendStatus(500);
		});//End of sequelize query
	});

	/* 
	* Example with one file upload
	* In this example, inside single() function, we use the name of the name of the element in the html
	* which we are sending the post, in this case, it is called file ( check line 19 of file.dust file )
	*/
	app.post('/file', upload.single('file'),function(req, res) {
	  	//res.json(req.file);
	  	if(req.file){
	      //Reading the file saved in src/temp folder
	      let fileContent = base64_encode(req.file.filename);//sendind filename which Multer gives
			  //Calling db(sequelize connector) and the entity (fileExample) to create the new data
			  db.fileExample.create(
			  	{fileName:req.file.originalname,fileExt:req.file.mimetype,file:fileContent }
			  ).then(function() {
			  	    console.log('Success!');
			  }, function (error) {console.log(error);res.sendStatus(500);
			  
			  });//
		}
	});

	/* Example with multi file upload
	* Using any() function, this make all elements that handle woth file in body tag
	* to be uploaded
	*/
	app.post('/files',upload.any(),function(req, res) {
	  	//res.json(req.files);
		if(req.files){
			req.files.forEach(function (item){
		    	//efetuando a leitura do arquivo
		    	let documento = base64_encode(item.filename);//Colocando o nome do arquivo que será enviado para o banco
		    	db.fileExample.create(
				  	{fileName:item.originalname,fileExt:item.mimetype,file:fileContent }
			    ).then(function() {
				    console.log('Success!');
		        }, function (error) {console.log(error);res.sendStatus(500);
		      	});//Fim do create de anexoss
		    });//Fim forEach
		}
	});

	//Convertendo binario em arquivo
	function base64_decode(base64str,fileName){
	  var bitmap = new Buffer (base64str, 'base64');
	  fs.writeFileSync('src/temp/'+fileName+'',bitmap, 'binary', function (err){
	    if(err){
	      console.log('Conversao com erro');
	    }
	  } );
	}

	//Convertendo arquivo em binário
	function base64_encode(file){
	  var bitmap = fs.readFileSync('src/temp/'+file+'');
	  return new Buffer (bitmap).toString('base64');
	}

};