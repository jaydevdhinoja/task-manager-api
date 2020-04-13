const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//create task
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(error)
    }
})

//read task
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res) => {
    try {
        //option 1:
        //const tasks = await Task.find({owner: req.user._id})

        //option 2:
        //this will populate all the tasks based on the foreign key set in user model
        const match = {}
        const sort={}
        
        if(req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:  parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(400).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowwUpdated = ['completed', 'description' ]

    //every runs against each item from array
    //returns true if all are true, if any of the item is false it will return false
    const isValidOperation = updates.every(update => allowwUpdated.includes(update))
    if(!isValidOperation) {
        return res.status(404).send({error: 'Invalid updates!'})
    }

    try {
        const _id = req.params.id

        const task = await Task.findOne({_id, owner: req.user._id})

        //new flag will return updated object other will return old object before update
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send()
    }
})



router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router