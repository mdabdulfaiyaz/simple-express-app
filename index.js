const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const posts = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

app.get('/user', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: posts.length,
    posts,
  });
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id * 1;
  const post = posts.find((el) => el.id === id);

  if (id > posts.length || id === 0) {
    return res.status(404).json({
      status: '404 Error',
      message: 'User not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      post,
    },
  });
});

app.post('/add/user', (req, res) => {
  const newId = posts[posts.length - 1].id + 1;
  const newPost = Object.assign({ id: newId }, req.body);
  console.log(req.body);

  posts.push(newPost);

  fs.writeFile(`./data.json`, JSON.stringify(posts), (err) => {
    res.status(201).json({
      status: 'Success',
      data: {
        post: newPost,
      },
    });
  });
});

app.put('/edit/user/:id', (req, res) => {
  const id = req.params.id * 1;
  const post = posts.find((el) => el.id === id);

  if (id > posts.length || id === 0) {
    return res.status(404).json({
      status: '404 Error',
      message: 'User not found',
    });
  }

  const index = posts.indexOf(post);
  Object.assign(post, req.body);
  posts[index] = post;

  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(posts), (err) => {
    res.status(200).json({
      status: 'Post Update Success',
      data: {
        posts: post,
      },
    });
  });
});

app.delete('/delete/user/:id', (req, res) => {
  const id = req.params.id * 1;
  const post = posts.find((el) => el.id === id);

  if (id > posts.length || id === 0) {
    return res.status(404).json({
      status: '404 Error',
      message: 'User not found',
    });
  }

  const index = posts.indexOf(post);
  posts.splice(index, 1);

  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(posts), (err) => {
    res.status(200).json({
      status: 'Post deleted',
      data: null,
    });
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}..!!`);
});
