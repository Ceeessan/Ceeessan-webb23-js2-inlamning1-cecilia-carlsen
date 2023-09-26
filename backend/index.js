const _ = require("underscore");
const express = require("express");
const fs = require('fs');


const app = express();
app.use(express.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/highscore', (req, res) => {
    try {
        const highScore = fs.readFileSync("./data/highScore.json")

        const userNameScore = JSON.parse(highScore);

        res.send(userNameScore);
    } catch (error) {
        console.error('Error reading highscore file:', error);
        res.status(500).send('Internal Server Error');
    }
});


const highScoreFilePath = "./data/highScore.json";

app.post('/name', async (req, res) => {

    try {
        const highScoreData = JSON.parse(fs.readFileSync(highScoreFilePath));

        const { name, score } = req.body;

        let updated = false;

        for (let i = 0; i < highScoreData.length; i++) {
            if (score > highScoreData[i].score) {
                highScoreData.splice(i, 0, { name, score });
                updated = true;
                break;
            }
        }

        if (updated) {
            const top5Scores = _.sortBy(highScoreData, "score").reverse().slice(0, 5);

            await fs.promises.writeFile(highScoreFilePath, JSON.stringify(top5Scores));
            res.send(top5Scores);
        } else {
            res.send(highScoreData.slice(0, 5));
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});