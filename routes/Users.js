const router = require('express').Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')
const Users = require('../models/Users')
const CryptoJS = require("crypto-js");


// UPDATING EXISTING USER DATA; 

//we want to update user so we will use accessToen to verify that the same user logged in is accessing this route to update the file

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    // const { username, password, email } = req.body;
    const userId = req.params.id;


    const hashedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()

    req.body.password = hashedPassword



    try {
        const updatedUser = await Users.findOneAndUpdate(
            { _id: userId },
            {
                $set: req.body
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json('User not found');
        }

        return res.json(updatedUser);
    } catch (error) {
        return res.status(400).json(error);
    }
});

//DELETE USER;

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {

    const userId = req.params.id

    try {
        const userToDelete = await Users.deleteOne({ _id: userId })

        return res.json('User Deleted Successfully')

    } catch (error) {
        return res.status(400).json(error)
    }

})

//Get Particular USER ;

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {

    const userId = req.params.id

    try {

        const user = await Users.findById(userId);

        const { password, ...others } = user._doc

        res.json(others)

    } catch (error) {
        return res.status(400).json(error)
    }

});

//Get All Users (we are designing in a way that only admin could view all the users: )

router.get('/', verifyTokenAndAdmin, async (req, res) => {

    // the query is used in the params as /user?new=true 
    //the new paramter is set here
    const query = req.query.new


    try {
        const allUsers = query ? await Users.find().sort({ _id: -1 }).limit(5) : await Users.find();

        return res.json(allUsers)

    } catch (error) {
        res.status(500).json(error)
    }

})


//GET USER STATS

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    try {
        const date = new Date(); // cuurent dat for eg Jan 15, 2023

        // Subtract one year from the current year
        // Explanation:
        // - `date.getFullYear()` returns the current year (e.g., 2023)
        // - `date.setFullYear(date.getFullYear() - 1)` sets the year of the 'date' object to the previous year (e.g., 2022)
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

        // 'lastYear' now holds a Date object representing the same date and time, but one year ago


        // Use the aggregate method on the Users collection
            const data = await Users.aggregate([
                // Stage 1: Match documents created in the last year
                {
                    $match: {
                        createdAt: { $gte: lastYear } // Filters documents where the 'createdAt' field is greater than or equal to 'lastYear'
                    }
                },
                // Stage 2: Project a new field 'month' by extracting the month from 'createdAt'
                {
                    $project: {
                        month: { $month: '$createdAt' } // Extracts the month from the 'createdAt' field and assigns it to 'month'
                    }
                },
                // Stage 3: Group the documents by 'month' and count the occurrences in each group
                {
                    $group: {
                        _id: "$month",   // Groups documents by 'month' field
                        total: { $sum: 1 } // Counts the number of documents in each group
                    }
                }
            ]);

        // Send the aggregated data as a JSON response
        res.json(data);
    } catch (error) {
        // Handle any errors and send a 500 (Internal Server Error) response
        res.status(500).json(error);
    }
});





module.exports = router