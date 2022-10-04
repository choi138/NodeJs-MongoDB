const express = require('express'); // 라이브러리 임포트
const app = express(); // express 객체 생성
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true })) // body-parser 사용

let db; // 데이터베이스 객체를 저장할 변수 선언
const MongoClient = require('mongodb').MongoClient; // 몽고디비 사용
MongoClient.connect('mongodb+srv://kidjustinchoi:kidjustin0524@cluster0.s2yc1kc.mongodb.net/todoapp?retryWrites=true&w=majority', (error, client) => {
    if (error) return console.log(error);
    db = client.db('todoapp'); // todoapp이라는 db로 연결

    db.collection('post').insertOne({ name: 'justin', _id: 100 }, (error, asdf) => {
        console.log('저장완료'); //post라는 파일에 InsertOne{자료}로 저장
    });

    app.listen(8080, () => { // 3000번 포트로 서버 실행
        console.log('Server is running on port 8080');
    }); // 서버 실행
})



// 누군가가 /pet으로 방문을 하면 pet관련된 안내문을 띄워주자

app.get('/pet', (req, res) => { // request(요청), response(응답);
    res.send('This is pet page');
});

app.get('/beauty', (req, res) => { // request(요청), response(응답);
    res.send('This is page is about beauty');
});

app.get('/', (req, res) => { // request(요청), response(응답);
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', (req, res) => { // request(요청), response(응답);
    res.sendFile(__dirname + '/write.html');
});

// /add라는 경로로 post방식으로 요청이 들어오면
// 데이터 2개(날짜, 제목)를 보내주는데,
// 이 때, 'post'라는 이름으로 가진 collection에 데이터 두개를 저장하기
// collection은 하나의 파일명 같은거임 ㅇㅇ. 그래서 post라는 파일에 데이터를 저장하겠다는 뜻
// {제목: '어쩌구', 날짜: '저쩌구}

app.post('/add', (req, res) => { // POST요청 처리를 하려면 app.post를 사용
    res.send('add');
    // console.log(req.body.title) // req.body로 POST요청의 body를 받아올 수 있다.
    // console.log(req.body.date);
    db.collection('post').insertOne({ 제목: req.body.title, 날짜: req.body.date }, (error, asdf) => {
        console.log('포스트에 저장완료'); //post라는 파일에 InsertOne{자료}로 저장
    });
});