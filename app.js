// 필요한 모듈을 가져옵니다.
const express = require('express'); // Express.js 웹 프레임워크
const path = require('path'); // 파일 경로 관련 유틸리티
const morgan = require('morgan'); // HTTP 요청 로깅을 위한 미들웨어
const nunjucks = require('nunjucks'); // 템플릿 엔진

// 모델과 라우터를 가져옵니다.
const { sequelize } = require('./models'); // models 폴더 안에 있는 index.js 연결
const indexRouter = require('./routes'); // routes 폴더의 index.js 연결
const usersRouter = require('./routes/users'); // routes/users.js 연결
const commentsRouter = require('./routes/comments'); // routes/comments.js 연결

// Express 앱을 생성합니다.
const app = express();

// 앱의 설정을 구성합니다.
app.set('port', process.env.PORT || 3001); // 포트 설정 (process.env.PORT 없으면 3001번으로)
app.set('view engine', 'html'); // 템플릿 엔진 설정 (HTML 사용)
nunjucks.configure('views', { // 템플릿 엔진의 뷰 폴더 설정 (views폴더)
  express: app, // 14번 라인에서 설정한 app
  watch: true, // 템플릿 파일 변경 감지 활성화
});

// Sequelize를 사용하여 데이터베이스 연결 설정
sequelize.sync({ force: false }) // 335p 데이터베이스 테이블을 생성 (force: true일 경우 실행할때마다 테이블 재생성) 
  .then(() => { //성공하면
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => { //실패하면
    console.error(err);
  });

// 미들웨어 설정
app.use(morgan('dev')); // HTTP 요청 로그 출력 미들웨어
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공을 위한 미들웨어 ( /public를 기본으로 연결 )
app.use(express.json()); // JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: false })); // URL-encoded 데이터 파싱 미들웨어

// 라우팅 설정
app.use('/', indexRouter); // 루트 경로로 들어오면 indexRouter로 연결
app.use('/users', usersRouter); // '/users' 경로로 들어오면 usersRouter로 연결
app.use('/comments', commentsRouter); // '/comments' 경로로 들어오면 commentsRouter로 연결

// 위에서 설정한 라우터에 해당하지 않는 모든 요청에 대한 에러 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message; // 에러 메시지 설정
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500); // 상태 코드 설정 (기본값 500)
  res.render('error'); // 에러 페이지 렌더링
});

// 앱을 지정된 포트에서 시작
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});