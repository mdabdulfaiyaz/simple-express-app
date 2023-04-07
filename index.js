const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = JSON.parse(fs.readFileSync(`./data.json`, 'utf8'));
console.log(tasks);

const checkID = () => {};

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    tasks,
  });
});

app.get('/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tasks.length || id === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'please enter a valid id',
    });
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return res.status(200).json({
        status: 'success',
        task: tasks[i],
      });
    }
  }
});

app.post('/add/todo', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    task: req.body.task,
  };
  tasks.push(newTask);
  fs.writeFile(`./data.json`, JSON.stringify(tasks), (err) => {
    res.status(201).json({
      status: 'Task added successfully',
      task: newTask,
    });
  });
});

app.put('/edit/:id', (req, res) => {
  const id = req.params.id * 1;
  const editTask = req.body;

  if (id > tasks.length || id === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'please enter a valid id',
    });
  }
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      Object.assign(tasks[i], editTask);
    }
  }
  fs.writeFile(`./data.json`, JSON.stringify(tasks), (req, err) => {
    res.status(201).json({
      status: 'Task edited successfully',
      editTask,
    });
  });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tasks.length || id === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'please enter a valid id',
    });
  }
  const deletedTask = tasks.filter((task) => task.id === id);
  const remainingTasks = tasks.filter((task) => task.id !== id);

  fs.writeFile(`./data.json`, JSON.stringify(remainingTasks), (req, err) => {
    res.status(201).json({
      status: 'Task deleted successfully',
      deletedTask,
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...!!!`);
});
