const { create_list, delete_list, get_list, update_list, get_list_id, get_all_list } = require('../controllers/listController')
const verify = require('../middleware/verifyToken')

const router = require('express').Router()


//CREATE List
router.post('/', verify, create_list)
//DELETE LIST
router.delete('/:id', verify, delete_list)
//Update LIST
router.put('/:id', verify, update_list)
//GET LIST by query
router.get('/find', verify, get_list)
//GET ALL LIST
router.get('/', verify, get_all_list)
//GET LIST by ID
router.get('/find/:id', verify, get_list_id)


module.exports = router