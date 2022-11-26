const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nort6.mongodb.net/myFirstDB?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const DB = client.db("file_manager");
        const fileStructure = DB.collection('file-structure');

        //get all folder
        app.get('/structured-file', async (req, res) => {
            const files = await fileStructure.find({}).sort({ "parentId": -1 }).toArray();
            const structure = () => {
                let sameParent = [];
                for (let i = 0; i < files.length; i++) {
                    if (sameParent.length < 1) {
                        sameParent.push(files[i]);
                    } else if (sameParent.length > 0) {
                        if (sameParent[0]?.parentId === files[i]?.parentId) {
                            sameParent.push(files[i]);
                        } else if (sameParent[0]?.parentId !== files[i]?.parentId && sameParent[0]?.parentId === files[i]?.id) {
                            files[i].child = sameParent;
                            files.splice(0, sameParent.length);
                            sameParent = [];
                            break;
                        }
                    }
                }
                if (files.length > 1) {
                    structure(files);
                }
            }
            structure(files);
            res.send(files);
        })

        //get all folder
        app.get('/file-name', async (req, res) => {
            const file = await fileStructure.find({}).toArray();
            res.send(file);
        })

        app.post('/create', async (req, res) => {
            const lastItem = await fileStructure.find().sort({ $natural: -1 }).limit(1).toArray();
            const data = req.body;
            data.id = lastItem[0].id + 1;
            data.child = [];
            const result = await fileStructure.insertOne(req.body);
            res.send(result);
        })

        // delete single folder
        app.delete('/delete/:_id', async (req, res) => {
            const id = req.params._id;
            const result = await fileStructure.deleteMany({ _id: ObjectId(id) });
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Server is running at port: ', port);
})