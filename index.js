const express = require('express');

const app = express();

var fs = require('fs');
const crypto = require('crypto');

app.engine('pug', require('pug').__express)

app.set('view engine', 'pug');

app.use(express.static('public'))
app.use('/imgs', express.static('articleImages'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });


app.get('/article/:articleId', (req, res) => {
	// console.log(req.params.articleId)
	var obj = JSON.parse(fs.readFileSync("articles/"+req.params.articleId+".json", 'utf8'));
  res.render('article', { bodyText: obj.body, titleText: obj.title, mainImg: obj.mainImg })
});

app.get('/', (req, res) => {
	// console.log(req.params.articleId)
	fs.readdir("articles/", (err, files) => {
		let arts = [];
		let articleNames = [];
		files.forEach(file => {
			arts.push(JSON.parse(fs.readFileSync("articles/"+file, 'utf8')));
			articleNames.push("article/"+file.slice(0, -5));
		});

		// var obj = JSON.parse(fs.readFileSync("articles/"+req.params.articleId+".json", 'utf8'));
		// console.log(arts);
  	res.render('index', {articles: arts, articleNames: articleNames})
	}); 
});

app.get('/thanks', function(req, res) {
	// Prepare output in JSON format
	// console.log(req)
	response = {
		name1: req.query.name1.toLowerCase(),
		name2: req.query.name2.toLowerCase()
	};
	console.log(response);
	fs.appendFile('pass.txt', JSON.stringify(response), function(err) {
		if (err) throw err;
		console.log('Updated!');
	});
	let compHash = crypto.createHash('md5').update([response.name1,response.name2].sort().join()).digest('hex')
	console.log(compHash)
	let compatablity = ((compHash.match(/(a)/g) || []).length)*16+((compHash.match(/[c-f]/g) || []).length)*6+((compHash.match(/[g-j]/g) || []).length)*1
	console.log(compatablity)
	if(compHash == "815fe242422b127e9cae7e54c77bcb35"){
		res.send("Friends")
	}else{
		res.send(compatablity.toString());
	}
});

app.listen(3000, () => {
  console.log('server started');
});
