const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


// const me = new User({
//     name: '   jaydev1     ',
//     email: 'jay@jd.com   ',
//     password: '  re32 '
// })

// me.save().then( () => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })

// const task = new Task({
//     description: '  Learn Mongoose AGAIN AGAIN  '
// })

// task.save().then(() => {
//     console.log(task)
// }).catch(() => {
//     console.log('Error!', error)
// })
