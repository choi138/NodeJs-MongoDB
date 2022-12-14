const express = require('express'); // 라이브러리 임포트
const app = express(); // express 객체 생성
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true })) // body-parser 사용
const MongoClient = require('mongodb').MongoClient; // 몽고디비 사용
const methodOverride = require('method-override'); // method-override 사용
app.use(methodOverride('_method')); // method-override 사용
app.set('view engine', 'ejs'); // ejs 사용
app.use(express.static('public')); // public 폴더 사용

let db; // 데이터베이스 객체를 저장할 변수 선언

MongoClient.connect('mongodb+srv://kidjustinchoi:kidjustin0524@cluster0.s2yc1kc.mongodb.net/todoapp?retryWrites=true&w=majority', (error, client) => {
    if (error) return console.log(error);
    db = client.db('todoapp'); // todoapp이라는 db로 연결

    // db.collection('post').insertOne({ name: 'justin', _id: 100 }, (error, asdf) => {
    //     console.log('저장완료'); //post라는 파일에 InsertOne{자료}로 저장
    // });

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
    res.render('index.ejs');
});

app.get('/write', (req, res) => { // request(요청), response(응답);
    res.render('write.ejs');
});

// /add라는 경로로 post방식으로 요청이 들어오면
// 데이터 2개(날짜, 제목)를 보내주는데,
// 이 때, 'post'라는 이름으로 가진 collection에 데이터 두개를 저장하기
// collection은 하나의 파일명 같은거임 ㅇㅇ. 그래서 post라는 파일에 데이터를 저장하겠다는 뜻
// {제목: '어쩌구', 날짜: '저쩌구}

app.post('/add', (req, res) => { // 누가 폼에서 /add로 POST요청 하면
    // counter라는 콜렉션에 있는 totalPost라는 값을 1증가시켜야함. 게시물 하나 등록할때마다 카운터도 1 증가시켜야함
    db.collection('counter').findOne({ name: '게시물갯수' }, (error, result) => {
        console.log(result.totalPost); // DB.counter 내의 총게시물갯수(totalPost)를 찾음
        let 총게시물갯수 = result.totalPost; // 총게시물갯수를 변수에 저장
        // console.log(req.body.title) // req.body로 POST요청의 body를 받아올 수 있다.
        db.collection('post').insertOne({ _id: 총게시물갯수 + 1, 제목: req.body.title, 날짜: req.body.date }, (error, result) => { // DB.post에 새게시물 기록
            console.log('포스트에 저장완료');
            // counter라는 콜렉션에 있는 totalPost라는 항목도 1 증가시켜야함.
            db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } },
                // db데이터 하나를 수정할때 updateOne함수를 씀.  여러개는 updateMany
                // updateOne(요런데이터를, 이렇게 수정해주셈) 어떤 데이터를 수정할지 정하는게 맨 앞에 있는 {}임. 수정값을 정하는게 중간에 있는 {}임. 
                // { $set: { totalPost: 바꿀값} } 쉽게 말해 set은 변경. 
                // { $inc: { totalPost: 기존값에 더해줄 값 } } inc는 기존값에 더해주는것임.
                (error, result) => {
                    if (error) return console.log(error);
                    else {
                        res.redirect('/list');
                    }
                })
        });
    });

});

// /list라는 경로로 get방식으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTMl을 보여줌

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((error, result) => { // post라는 collectoin안의 모든 데이터를 가져옴
        // console.log(result); // 가져온 데이터를 콘솔에 출력
        console.log(error)
        res.render('list.ejs', { posts: result }); // res.render('list.ejs')는 list.ejs파일을 렌더링. ejs파일은 views폴더에 있어야함
    });
    // DB에서 데이터를 가져와서 list.ejs파일에 집어넣기.

});

app.delete('/delete', (req, res) => {
    console.log(req.body) // 요청시 함께 보내 데이터를 받아옴.  
    req.body._id = parseInt(req.body._id)
    // req.body에 담겨온 게시물번호를 가진 글을 DB에서 찾아서 삭제
    db.collection('post').deleteOne(req.body, (error, result) => { // 멘 앞에는 어떤 항목을 삭제할지 정한다.
        console.log('삭제완료');
        res.status(200).send({ message: '성공했습니다' }); // 성공했다는 메세지를 보냄   
        // res.status(400).send({ message: '실패했습니다' }); // 실패했다는 메세지를 보냄
    })
})

//  /detail로 접속하면 detail.ejs 보여줌
// /detail2로 접속하면 detail2.ejs 보여줌
// /detail3로 접속하면 detail3.ejs 보여줌

app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
        console.log(result)
        res.render('detail.ejs', { data: result }); // { 이런이름으로: 이런데이터를 } 이란 뜻임.
        if (error) return res.send('에러가 발생했습니다');
    })
})

// 게시글마다 각각 다른 edit.ejs 내용이 필요함 

// GET요청은 데이터를 가져오는 요청
// POST요청은 데이터를 생성하는 요청
// PUT요청은 데이터를 수정하는 요청
// DELETE요청은 데이터를 삭제하는 요청

app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, (error, result) => {
        console.log(result)
        res.render('edit.ejs', { post: result }); // { 이런이름으로: 이런데이터를 } 이란 뜻임.
        if (error) return res.send('에러가 발생했습니다');
    })
})

app.put('/edit', (req, res) => {
    // 폼에 담긴 제목 데이터, 날짜 데이터를 가지고 db.collection에 업데이트 함
    db.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { 제목: req.body.title, 날짜: req.body.date } }, (error, result) => {
        // updateOne(어떤게시물수정할건지, 수정값, 콜백함수) $set 업데이트 해주세요(없으면 추가해주시고요)라는 뜻
        console.log('수정완료');
        if (error) return res.send('에러가 발생했습니다');
        res.redirect('/list');
    })
});




const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({ // 미들웨어 요청과 응답 중간에 실행되는 함수(app.use)
    secret: '비밀코드', // session을 만들때 비밀번호
    resave: true,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



// 로그인 페이지 제작 & 라우팅
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

//로그인을 하면.. 아이디 비번 검사 
// passport: 로그인 기능 쉽게 구현 도와줌 authenticate는 인증해주세요 함수
app.post('/login', passport.authenticate('local', {
    // local 방식으로 회원인지 인증해주셈 
    failureRedirect: '/fail' // 로그인 실패시 /fail로 이동
}), (req, res) => {
    res.redirect('/'); // 로그인 성공시 /로 이동
})

// 아이디 비번 인증하는 세부코드 작성
passport.use(new LocalStrategy({
    usernameField: 'id', // 유저가 입력한 아이디/비번 항목이 뭔지 정의(form의 name값)
    passwordField: 'pw',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
}, (inputId, inputPw, done) => {
    // 아이디와 비번 검증 부분
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: inputId }, (err, result) => {
        if (err) return done(err) // done()은 3개의 파라미터를 가질 수 있음. 맨 처음엔 서버에러, 두번째에는 성공시사용자db데이터, 세번째에는 에러 메세지

        if (!result) return done(null, false, { message: '존재하지않는 아이디요' }) // result가 아이디가 없을때 이걸 실행함
        if (inputPw == result.pw) { // result가 있으면 이걸 실행
            return done(null, result)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
}));

// 아이디/비번 맞으면 세션을 하나 만들어줘야됨
// 로그인 성공-> 세션정보를 만듦-> 마이페이지 방문시 세션검사
// id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동)
passport.serializeUser(function (user, done) { //serializeUser는 유저의 정보를 serialize함 암호를 만들어서 세션에 저장시킴
    // user: 로그인 성공시 done()의 두번째 인자값
    done(null, user.id)
});

// 이 세션 데이터를 가진 사람을 db에서 찾기(마이페이지 접속시 발동)
passport.deserializeUser(function (id, done) {
    done(null, {})
});



