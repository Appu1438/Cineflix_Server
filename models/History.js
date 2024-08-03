const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    title: { type: String, default: 'History' },
    userId: { type: String },
    content: { type: Array },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("History", HistorySchema)