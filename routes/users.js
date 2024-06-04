const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
// Mock database
let users = [
  {
    id: uuidv4(),
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
  },
  {
    id: uuidv4(),
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alicesmith@example.com',
  },
];
const MAX_NAME_LENGTH = 32;

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Getting the list of users from the mock database
router.get('/', (req, res) => {
  res.send(users);
});



// Add a new user
router.post('/', (req, res) => {
  const { first_name, last_name, email } = req.body;

  // Validation
  if (!first_name) {
    return res.status(400).send('First name is required.');
  }

  if (!email) {
    return res.status(400).send('Email is required.');
  }
  if (first_name.length > MAX_NAME_LENGTH) {
    return res.status(400).send(`First name must be less than ${MAX_NAME_LENGTH} characters.`);
  }

  if (last_name.length > MAX_NAME_LENGTH) {
    return res.status(400).send(`Last name must be less than ${MAX_NAME_LENGTH} characters.`);
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format.');
  }
  // Check for duplicate email
  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    return res.status(400).send('Email already exists.');
  }

  const user = { ...req.body, id: uuidv4() };
  users.push(user);

  res.send(`${user.first_name} has been added to the Database`);
});
// Getting a specific user data from database
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const foundUser = users.find((user) => user.id === id)

  res.send(foundUser)
});
//delete a user from the database
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)[0]; // Removes the user from the array
    res.status(200).send(deletedUser);
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});
//updating the data

router.patch('/:id', (req, res) => {
  const { id } = req.params;

  const { first_name, last_name, email } = req.body;

  const user = users.find((user) => user.id === id)

  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (email) user.email = email;

  res.send(`User with the ${id} has been updated`)

});

module.exports = router;
