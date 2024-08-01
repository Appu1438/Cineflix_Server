const Movie = require('../models/Movie')

const add_movie = async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body)
        try {
            const savedMovie = await newMovie.save()
            res.status(200).json(savedMovie)

        } catch (error) {
            res.status(500).json(error)

        }

    } else {
        res.status(403).json("You are not allowded")

    }
}

const update_movie = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedMovie)

        } catch (error) {
            res.status(500).json(error)

        }

    } else {
        res.status(403).json("You are not allowded")

    }
}

const delete_movie = async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
            res.status(200).json(deletedMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("You are not allowded")

    }
}

const get_movie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    }
}

const get_random_movie = async (req, res) => {
    const type = req.query.type
    let movie;
    try {
        if (type == 'series') {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ])
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ])
        }
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    }
}



module.exports = {
    add_movie,
    update_movie,
    delete_movie,
    get_movie,
    get_random_movie
}

