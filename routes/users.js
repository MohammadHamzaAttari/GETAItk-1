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

  const foundUser = users.find((user) => user.id === id);

  if (!foundUser) {
    return res.status(404).send({ message: 'User not found' });
  }

  res.send(foundUser);
});

// Update a user
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (email) user.email = email;

  res.send(`User with the id ${id} has been updated`);
});

// Delete a user with confirmation
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const confirmation = req.query.confirmation === 'true';
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (!confirmation) {
    return res.status(200).send({
      message: `Are you sure you want to delete user with id ${id}?`,
      confirmation: false
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0]; // Removes the user from the array
  return res.status(200).send({
    message: `User with id ${id} deleted successfully`,
    user: deletedUser
  });
});

module.exports = router;
