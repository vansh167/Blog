const User = require('../models/User');
const UserRequest = require('../models/UserRequest');
const bcrypt = require('bcryptjs');

// GET /api/requests - Admin: get all pending requests
exports.getRequests = async (req, res) => {
    try {
        const requests = await UserRequest.find({ status: 'pending' });
        res.json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ message: 'Server error while fetching requests' });
    }
};

// POST /api/requests - Create a new signup request (public)
exports.createRequest = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        const existingRequest = await UserRequest.findOne({ email });

        if (existingUser)
            return res.status(400).json({ message: 'This email is already approved and active.' });
        if (existingRequest)
            return res.status(400).json({ message: 'This email already requested approval.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRequest = new UserRequest({
            name,
            email,
            password: hashedPassword,
            status: 'pending',
        });

        await newRequest.save();
        res.status(201).json({ message: 'Signup request submitted for admin approval.' });
    } catch (err) {
        console.error('Error creating request:', err);
        res.status(500).json({ message: 'Server error while creating request' });
    }
};

// PUT /api/requests/:id/accept - Admin: approve request
exports.acceptRequest = async (req, res) => {
    try {
        const request = await UserRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Create new User
        const newUser = new User({
            name: request.name,
            email: request.email,
            password: request.password, // already hashed
        });

        await newUser.save();
        await request.deleteOne(); // remove the request
        res.json({ message: 'User approved successfully' });
    } catch (err) {
        console.error('Error accepting request:', err);
        res.status(500).json({ message: 'Server error while accepting request' });
    }
};

// PUT /api/requests/:id/reject - Admin: reject request
exports.rejectRequest = async (req, res) => {
    try {
        const request = await UserRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        await request.deleteOne();
        res.json({ message: 'Request rejected successfully' });
    } catch (err) {
        console.error('Error rejecting request:', err);
        res.status(500).json({ message: 'Server error while rejecting request' });
    }
};
