
const mongodb = require('mongodb')
const { MongoClient, ObjectID} = mongodb

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Jaydev',
    //     age: 37
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert a document')
    //     }
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Joe',
    //         age: 24
    //     },
    //     {
    //         name: 'Bob',
    //         age: 34
    //     },
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert a document')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'buy groceries',
    //         completed: true
    //     },
    //     {
    //         description: 'clean the house',
    //         completed: true
    //     },
    //     {
    //         description: 'walk the dog',
    //         completed: false
    //     }

    // ], (error, result) => {
    //     if(error) {
    //         return console.log(error)
    //     }

    //     console.log(result.ops)

    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("5e7c91a6f967b25552186434")}, (error, task) => {
    //     if(error) {
    //         return console.log(error)
    //     }

    //     console.log(task)
    // })

    // db.collection('users').updateOne({ _id: new ObjectID('5e7c90802c47b05545ce22b8')},
    //     {
    //         $set : {
    //             name: 'Sam',
    //             age: 37
    //         }
    //     }
    // ).then(result => {
    //     console.log(result)
    // }).catch( error => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({ completed: false },
    //     {
    //         $set : {
    //             completed: true
    //         }
    //     }
    // ).then(result => {
    //     console.log(result.modifiedCount)
    // }).catch( error => {
    //     console.log(error)
    // })

    db.collection('users').deleteMany({ age: 37 }).then(result => {
        console.log(result)
    }).catch( error => {
        console.log(error)
    })

})