const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const multer = require('multer');
const fs=require('fs');

const secretKey = "secretkey";

// Middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(cors()); 
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(bodyParser.json()); 

// MongoDB connection
const Mongo_url = "mongodb+srv://payal647be22:payal066@skincare.vyux8.mongodb.net/skincare?retryWrites=true&w=majority&appName=skincare";
mongoose.connect(Mongo_url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarId: {type:String},
});
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

//generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, secretKey, { expiresIn: '1h' });
    return token;
};


const User = mongoose.model('User', userSchema);

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        console.log('New user created:', newUser); // Log the new user object

        const token = newUser.generateAuthToken();
        res.cookie('authToken', token, {
            httpOnly: true, // Prevent client-side access
            secure: true, // Use HTTPS in production
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
        });
        res.status(201).json({ message: 'User created', token });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Database error', message: err.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        console.log("User found check done");
        // Compare provided password with the hashed password in DB
        const match = await bcrypt.compare(password, user.password);    
        if (match) {
            const token = user.generateAuthToken();
                        res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000, // 1 hour
            });

            res.status(200).json({ message: 'Login successful', name: user.name, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Database error', message: err.message });
    }
});



// Contact Us 
const Contact = mongoose.model('Contact', contactSchema);
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ message: 'Message received' });
    } catch (err) {
        console.error('Error saving contact message:', err);
        res.status(500).json({ error: 'Database error', message: err.message });
    }
});

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey); //we need raw token for verification not beearer
        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Account details endpoint
app.get('/user-details', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name email avatarId');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const avatarUrl = user.avatarId
            ? `http://localhost:5000/uploads/${user.avatarId}`
            : null; // Handle case when avatarId is not set

        res.status(200).json({ name: user.name, email: user.email, avatarUrl });
    } catch (err) {
        console.error('Error fetching user details:', err.message);
        res.status(500).json({ error: 'Error fetching user details', message: err.message });
    }
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path to save files
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Store the file with a unique name
    },
});

const upload = multer({ storage: storage });

// Account deletion endpoint
app.delete('/delete-account', authenticate, async (req, res) => {
    console.log('Attempting to delete user with ID:', req.user._id);
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.avatarId) {
            const avatarPath = path.join(__dirname, 'uploads', user.avatarId);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Profile picture upload endpoint
app.post('/upload-avatar', authenticate, upload.single('avatar'), async (req, res) => {
    try {
        const avatarId = req.file.filename; // Filename of the uploaded image
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.avatarId) {
            const oldAvatarPath = path.join(__dirname, 'uploads', user.avatarId);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        user.avatarId = avatarId;
        await user.save();

        res.status(200).json({ avatarId });
    } catch (err) {
        console.error('Error saving avatar:', err);
        res.status(500).json({ message: 'Failed to save avatar' });
    }
});

  
// Route for getting all products - to get all products from backend
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Add Products Route
app.post('/api/products', (req, res) => {
    const products = req.body;  // This should be an array of product objects
  
    Product.insertMany(products)
      .then((result) => {
        res.status(201).json({ message: 'Products added', result });
      })
      .catch((error) => {
        console.error('Error adding products:', error);
        res.status(500).json({ message: 'Error adding products', error });
      });
  });
  

// Check if the 'Product' model is already defined
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Define Assessment Schema
const assessmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skinType: { type: String, required: true },
    question1: { type: String, required: true },
    question2: [{ type: String }], // Array to store multiple selections
    feedback: { type: String, required: true },
    consent: { type: Boolean, required: true },
});

// Create Assessment Model
const Assessment = mongoose.model('Assessment', assessmentSchema);

// Endpoint to handle assessment form submission
app.post('/api/submit-assessment', async (req, res) => {
    try {
        console.log('POST request received at /api/submit-assessment');
        const formData = req.body; // Access the parsed JSON body
        console.log('Form Data Received:', formData);

        // Save data to MongoDB
        const newAssessment = new Assessment(formData);
        await newAssessment.save(); // Save to the database

        res.status(200).json({ message: 'Assessment submitted successfully!' });
    } catch (error) {
        console.error('Error handling submission:', error);
        res.status(400).json({ error: 'Invalid data format' });
    }
});


//search api
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_image: { type: String, required: true },
    product_price: { type: Number, required: true },
  });
  
  app.get('/search/products', async (req, res) => {
    const query = req.query.q?.toLowerCase() || ""; // Ensure the query is handled safely
    console.log('Search query:', query); // Log the incoming query
    try {
        const results = await Product.find({
            product_name: { $regex: query, $options: 'i' } // Case-insensitive matching
        });
        console.log('Results found:', results); // Log the results
        res.json({ results: results });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Error fetching products" });
    }
});



//admin panel - to get admin details to mongodb
const Admin = require('./models/admin');
app.use('/admin', adminRoutes);
app.post('/admin-register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword, role });

        await newAdmin.save()
            .then((savedAdmin) => {
                console.log('Admin saved:', savedAdmin); // Log the saved admin object
                const token = newAdmin.generateAuthToken();
                res.status(201).json({ message: 'Admin created', token });
            })
            .catch((err) => {
                console.error('Error saving admin:', err); // Log the error in case of failure
                res.status(500).json({ error: 'Database error', message: err.message });
            });

    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ error: 'Database error', message: err.message });
    }
});



app.post('/get-all-admins', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.error('Admin not found:', email); // Debug log
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Validate the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.error('Password mismatch for email:', email); // Debug log
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate and send a token (if applicable)
    const token = 'someAuthToken'; // Replace with actual token generation logic
    res.status(200).json({ message: 'Admin authenticated', token });
  } catch (err) {
    console.error('Error during admin authentication:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
//upload image from admin panel
const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public'); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // File name will include timestamp
    }
  });
// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  };
  const upload1 = multer({ 
    storage: storage1, 
    fileFilter: fileFilter 
});


// Serve static files from the 'public' folder (including images)
app.use(express.static('public'));

// Add product route
app.post('/add-product', upload1.single('product_image'), async (req, res) => {
    try {
      console.log('Uploaded file:', req.file); // Debugging line to check the uploaded file
  
      const { product_name, product_price, quantity } = req.body;
      const product_image = req.file ? req.file.path : null; // Path to the uploaded image (relative to the 'public' folder)
  
      // Save product data to the database
      const newProduct = new Product({
        product_name,
        product_price,
        quantity,
        product_image
      });
  
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
  

// Get all users endpoint (for admin panel)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('name email avatarId');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Error fetching users', message: err.message });
    }
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
