const express = require('express'); // Added express import
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

//authentication 

const User = require('./models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with an actual secret key


// Handle connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create a new user
    const user = new User({ email, password });
    try {
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
});

// Define Task Schema
/*const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = Task;
*/

const Todo = require('./models/Todo');  

// Get all todos 
// Get all todos for the current user
app.get('/todos', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get token from Authorization header

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify the token and extract user ID
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        try {  
            const todos = await Todo.find({ user: decoded.id });  // Fetch todos for the user
            res.json(todos);  
        } catch (err) {  
            res.status(500).json({ message: err.message });  
        }  
    });
});


// Add a new todo
app.post('/todos', async (req, res) => {
    const { text } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Get token from Authorization header

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify the token and extract user ID
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const todo = new Todo({  
            text, 
            user: decoded.id  // Assign the current user's ID
        });

        try {  
            const newTodo = await todo.save();  
            res.status(201).json(newTodo);  
        } catch (err) {  
            res.status(400).json({ message: err.message });  
        }  
    });
});




// Update a todo 
app.put('/todos/:id', async (req, res) => {  
    try {  
        const updatedTodo = await Todo.findByIdAndUpdate(  
            req.params.id,  // The ID of the todo to update  
            {  
                text: req.body.text,  // The fields to update  
                completed: req.body.completed  
            },  
            { new: true }  // Option to return the updated document  
        );  

        if (!updatedTodo) {  
            return res.status(404).json({ message: 'Todo not found' });  
        }  

        res.json(updatedTodo);  
    } catch (err) {  
        res.status(400).json({ message: err.message });  
    }  
});  

// Delete a todo 
app.delete('/todos/:id', async (req, res) => {  
    try {  
        const todo = await Todo.findByIdAndDelete(req.params.id);  

        if (!todo) {  
            return res.status(404).json({ message: 'Todo not found' });  
        }  

        res.json({ message: 'Todo deleted' });  
    } catch (err) {  
        res.status(500).json({ message: err.message });  
    }  
});  

// Start the server and listen on the specified port 
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});  