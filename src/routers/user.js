const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }   
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }   
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }   
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowwUpdated = ['name', 'age', 'email', 'password', 'age' ]

    //every runs against each item from array
    //returns true if all are true, if any of the item is false it will return false
    const isValidOperation = updates.every(update => allowwUpdated.includes(update))
    if(!isValidOperation) {
        return res.status(404).send({error: 'Invalid updates!'})
    }

    try {
        //the reason for doing this is to run the mongooes middleware 
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

const upload = multer({
    //dest: 'avatars', - if not provided it won't save the image and pass its data back
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            console.log(file.originalname)
            cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        if(!user || !user.avatar) {
            throw new Error('no avatar found!')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(400).send({error: e.message})
    }
})


//NOT REQUIRED
// router.get('/users', async (req,res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

// router.get('/users/:id', auth, async (req,res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(400).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

// router.delete('/users/:id', auth, async (req,res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

// router.patch('/users/:id', auth, async (req,res) => {
//     const updates = Object.keys(req.body)
//     const allowwUpdated = ['name', 'age', 'email', 'password', 'age' ]

//     //every runs against each item from array
//     //returns true if all are true, if any of the item is false it will return false
//     const isValidOperation = updates.every(update => allowwUpdated.includes(update))
//     if(!isValidOperation) {
//         return res.status(404).send({error: 'Invalid updates!'})
//     }

//     try {
//         const _id = req.params.id

//         //the reason for doing this is to run the mongooes middleware 
//         const user = await User.findById(_id)
//         updates.forEach(update => user[update] = req.body[update])
//         await user.save()

//         //new flag will return updated object other will return old object before update
//         //this will however will not execute any middleware applied in mongooes
//         //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(400).send()
//     }
// })

module.exports = router