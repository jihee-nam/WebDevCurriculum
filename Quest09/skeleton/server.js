const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
let dataStore = {};

app.use(cors());
app.use(express.static('client'));//정적 파일을 제공하기 위한 client 폴더 설정
app.use(bodyParser.json());//요청 본문을 JSON 형식으로 파싱 -> 클라이언트에서 전송한 JSON을 서버에서 쉽게 사용 가능
app.use(bodyParser.urlencoded({ extended: true}));//URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결

app.post('/notes', (req, res) => {
    let key = req.body.id;
    let value = req.body.value;
    saveValueToFileSys(key, value);
})

function saveValueToFileSys (key, value) {
    const filePath = `./data/${key}.json`;
    if ( !fs.existsSync('./data') ) {//없으면 생성
        fs.mkdirSync('./data');
    }
    fs.writeFileSync(filePath, JSON.stringify(value));
    console.log(`Data of key ${key} has been saved to the file system`);
}

app.get('/notes/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const filePath = `./data/${key}.json`;
        const data = await fs.promises.readFile(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading data from file:', err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

app.delete('/notes/:key', async (req, res) => {
    try {
        const key = req.params.key;
        await fs.promises.unlink(`./data/${key}.json`, 'utf8');
        res.json({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`REST API is running at http://localhost:${port}`);
});


