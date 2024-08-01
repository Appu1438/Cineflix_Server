const List = require('../models/List')

const create_list = async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save()
            res.status(200).json(savedList)

        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("You are not allowded")
    }
}




module.exports = {
   
}

