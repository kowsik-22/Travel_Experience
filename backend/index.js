require("dotenv").config();

const mongoose = require("mongoose");
const config = require("./config.json");

const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { authenticateToken } = require("./utilities");

const User = require("./models/users.model");
const TravelStory = require("./models/travelStory.model");
const upload = require("./multer");
const fs =  require("fs");
const path = require("path");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    const accessToken = jwt.sign(
        {userId: newUser._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "72h"}
    );

    return res.status(201).json({
        error: false,
        user: {fullName: newUser.fullName, email: newUser.email},
        accessToken,
        message: "User created successfully",
    });
});

app.post("/login", async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user){
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "72h"}
    );

    return res.json({
        error: false,
        user: {fullName: user.fullName, email: user.email},
        accessToken,
        message: "Login successful",
    });
});

app.post("/google-login", async (req,res)=>{
    const { token, email, name } = req.body;
    try{
        const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const load = ticket.getPayload();
    if (load.email !== email) {
      return res.status(401).json({ message: "Email verification failed" });
    }
    let user  = await User.findOne({email});
    if(!user){
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = new User({
            fullName: name,
            email,
            password: hashedPassword
        });
        await user.save();
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    )

    return res.status(201).json({
        error: false,
        user: {fullName: user.fullName, email: user.email},
        accessToken,
        message: "Google login sucessful",
    });
    }

    catch(err){
        console.error("Google login failed:", err);
        return res.status(401).json({ message: "Invalid Google token" });
    }
})

app.get("/user", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const isUser = await User.findOne({_id: userId});
    if (!isUser) {
        return res.status(401);
    }
    return res.json({
        user: isUser,
        message: "",
    });

});

app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });
        await travelStory.save();
        return res.status(201).json({
            story: travelStory,
            message: "Added successfully",
        });
    }
    catch(error){
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
});

app.get("/get-all-stories", authenticateToken, async (req, res) => { 
    const { userId } = req.user;
    try{
        const travelStories = await TravelStory.find({ userId }).sort({ createdOn: -1 });
        return res.status(200).json({
            stories: travelStories,
        });
    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

app.post("/image-upload", upload.single("image"), async (req, res) => { 
    try{
        if(!req.file) {
            return res.status(400).json({ error: true, message: "No file uploaded" });
        }
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({imageUrl});
    }
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


app.delete("/delete-image", async (req, res) => {

    const { imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "Image URL is required" });
    }

    try{
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, "uploads", filename);
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({ error: false, message: "Image deleted successfully" });
        }
    else{
        res.status(200).json({ error: true, message: "Image not found" });
    }
}
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


// serves static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.post("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        // find the travel story by id and make sure it belongs to the user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if(!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }
        const placeholderUrl = `http://localhost:8000/assets/download(7).jpeg`;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderUrl;
        travelStory.visitedDate = parsedVisitedDate;


        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try{
        // find the travel story by id and make sure it belongs to the user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if(!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }
        await travelStory.deleteOne({_id: id, userId: userId});
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, "uploads", filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delete image file:",err);
            }
        });

        res.status(200).json({ message: "Deleted successfully" });
    }
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


app.put("/update-is-fav/:id", authenticateToken, async (req, res) => {

    const { id } = req.params;
    const { isFavorite } = req.body;
    const userId = req.user;

    try{
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId.userId });
        if(!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }
        travelStory.isFavorite = isFavorite;
        await travelStory.save();

        res.status(200).json({ story: travelStory, message: "Updated successfully" });
    }
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


app.get("/search", authenticateToken, async (req, res) => {
    const {query} = req.query;
    const { userId } = req.user;

    if(!query) {
        return res.status(400).json({ error: true, message: "Query is required" });
    }

    try{
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavorite: -1 });

        res.status(200).json({ stories: searchResults});
    }
    catch(error){
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});


app.get("/filter", authenticateToken, async (req, res) => {
    const {startDate, endDate} = req.query;
    const { userId } = req.user;

    try{
        //convert startDate and endDate from milliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));
        
        // find all travel stories within the date range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: {$gte: start, $lte: end},
        }).sort({ isFavorite: -1 });

        res.status(200).json({ stories: filteredStories });
    }
    catch{
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }

});


app.listen(8000);
module.exports = app;
