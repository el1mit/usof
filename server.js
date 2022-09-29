const express = require('express');
const app = express();

const cors = require('cors');
const ApiError = require('./utils/errorUtils');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/categories', require('./routes/categoriesRoutes'));
app.use('/api/comments', require('./routes/commentsRoutes'));

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.errorCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error', });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});
