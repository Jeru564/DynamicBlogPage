import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let posts = [];
let currentUser = '';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/submit', (req, res) => {
  currentUser = req.body.fname;
  res.render('home.ejs', { posts, name: currentUser });
});


app.get('/home', (req, res) => {
  res.render('home.ejs', { posts, name: currentUser });
});


app.get('/create', (req, res) => {
  res.render('create.ejs', { name: currentUser });
});


app.post('/newpost', (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toLocaleDateString();

  const newPost = {
    title,
    content,
    date,
    author: currentUser
  };

  posts.push(newPost);
  res.redirect('/home');
});


app.get('/post/:id', (req, res) => {
  const post = posts[req.params.id];
  if (!post) return res.send('Post not found');
  res.render('post.ejs', { ...post, name: currentUser });
});


app.get('/about', (req, res) => {
  res.render('about.ejs', { name: currentUser });
});


app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id)) {
    posts.splice(id, 1);
  }
  res.redirect('/home');
});

app.listen(port, () => {
  console.log(`✅ Blog server running at http://localhost:${port}`);
});
