const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); 
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({secret: 'secretCode', resave:true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// app.listen(3002, function(){
//     console.log('ddfsdf');
// });
// -> nodejs상에서 서버를 express로 만들기 위한 기본 문법(서버 오픈)
// listen(서버띄울 포트번호, 띄운 후 실행할 코드)

// 콜백함수 : 함수 안에 들어가는 함수 
// app.use(미들웨어) : 응답 중간에 뭔가 실행되는 코드

// MongoDB 접속
MongoClient.connect('mongodb+srv://lexie:coldplay7878@cluster0.znjtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(error, client){
    // 연결 되면 할 일 
    if (error) return console.log(error);

    db = client.db('todoApp');  // todoApp이라는 database에 연결좀요

    db.collection('post').insertOne({name: 'Lexie', age:27}, function(error, result){
        console.log('SUCCESS!');    // post라는 파일에 insertOne{자료}
    });

    // 서버띄우는 코드 여기로 옮기기
    app.listen('3002', function(){
      console.log('listening on 3002')
    });
  })

// GET request
app.get('/pet', function(request, response){
    response.send('펫용품 사세용');
});
app.get('/beauty', function(request, response){
    response.send('뷰티용품 사세용');
});
app.get('/', function(request, response){   // home
    response.sendFile(__dirname + '/index.html')
});
app.get('/write', function(request, response){   // home
    response.sendFile(__dirname + '/write.html')
});

  // '/list'로 GET요청하면 실제 DB에 저장된 HTML코드 보여주기
  app.get('/list', function(request, response){
    // DB에 저장된 post라는 collection안의 모든 데이터를 꺼내주세욤(find)
    db.collection('post').find().toArray((error, result) => { // toArray안에는 콜백함수가 들어감 
      console.log(result);
      // list.ejs로 보내기
      response.render('list.ejs', {list: result});
     // response.render('여기로', {이런이름으로: 이런데이터를});
    }); 
});

// POST request
app.post('/add', function(request, response){
    response.send('전송완료');
    console.log(request.body.title);
    console.log(request.body.date);
    // DB에 counter에 있는 총 게시물 갯수 꺼내오기(id생성)
    db.collection('counter').findOne({name : '게시물 갯수'}, (error, result) => {
        console.log(result.totalPost);
        const postCount = result.totalPost;

        // DB에 저장
        db.collection('post').insertOne({
            _id: postCount + 1,     // 총 게시물 갯수 + 1
            title: request.body.title,
            date: request.body.date
            }, function(error, result){
            console.log('SUCCESS!');

            // counter라는 collection에 있는 totalPost라는 항목 1증가(update)
            db.collection('counter').updateOne({name: '게시물 갯수'},{ $inc : {totalPost:1} },function(error,result){
                console.log('SECCESS +1 UPDATE');
                if(error){return console.log(error)}
            });
        });
        // { $set:{totalPost : 바꿀 값} }
        // { $inc:{totalPost : 기존값에 더해줄 값} }

    });
   
});

// DELETE request
app.delete('/delete',(request,response)=> {
    console.log(request.body._id);  // ajax 요청 시 data {_id: int}
    request.body._id = parseInt(request.body._id);  // 문자열로 넘어오기 때문에 숫자로 변환
    db.collection('post').deleteOne(request.body,(error,result)=>{
        console.log('DELETED');
        response.status(200).send({ message : 'deleted'});
    })
    
})


// GET request(detail)
app.get('/detail/:id', (request,response)=> {
    db.collection('post').findOne({_id : parseInt(request.params.id)}, (error,result)=>{
        console.log(result);
        response.render('detail.ejs', {data: result});
    })
})


// GET request(edit)
app.get('/edit/:id',(request,response) => {
    db.collection('post').findOne({_id : parseInt(request.params.id)},(error,result) => {
        response.render('edit.ejs',{data: result});
    })
})

// PUT request(edit)
app.put('/edit',(request,response) => {
    // form에 담긴 제목, 날짜 가지고 db.collection에 업데이트
    db.collection('post').updateOne({_id : parseInt(request.body.id) }
    ,{ $set : {title: request.body.title, 
                date: request.body.date}}
    ,(error,result) => {
       console.log(request.body.id);
       console.log(request.body.title);
       console.log(request.body.date);
       console.log('UPDATED');
       response.redirect('/list');
    })
})
// updateOne( 1.업데이트할게시물찾기, 2.수정할내용, 3.콜백함수)
app.get('/login',(req,res) => {
    res.render('login.ejs');
})

app.post('/login', 
        passport.authenticate('local',{failureRedirect: '/fail'}), 
        (req,res) => {
    // authenticate() : 인증해주세요~
    res.redirect("/");
})

// passport.use(new LocalStrategy({
//     usernameField: 'id',    
//     passwordField: 'pw',    // -> 유저가 입력한 아이디/비번 항목이 뭔지 정의(name속성)
//     session: true,
//     passReqToCallback: false,   // -> 로그인 후 세션을 저장할것인지 참거짓여부 저장
//   }, function (_id, _pw, done) {    // 입력한 아이디, 입력한 비번
//     //console.log(_id, _pw);
//     db.collection('login').findOne({ id: _id }, function (error, result) {
//       if (error) return done(error)
  
//       if (!result) return done(null, false, { message: '존재하지 않는 아이디요' })
//       if (_pw == result.pw) {
//         return done(null, result)
//       } else {
//         return done(null, false, { message: '비번 틀렸어요' })
//         // done(서버에러,성공시 사용자 DB 데이터, 에러메세지) 
//       }
//     })
//   }));

  // 세션데이터를 만들고 세션아이디를 만들어 보내주는 것도 라이브러리 도움
//   passport.serializeUser(function (user, done) {
//     done(null, user.id)
//   });
//   // serializeUser
//   // 유저의 id 데이터를 바탕으로 세션데이터를 만들어주고
//   // 그 세션데이터의 아이디를 쿠키로 만들어서 사용자의 브라우저로 보내줌
//   passport.deserializeUser(function (아이디, done) {
//     done(null, {})
//   }); 
