// 필요한 모듈과 모델을 가져옵니다.
const Sequelize = require('sequelize'); // Sequelize ORM을 사용하기 위한 모듈
const User = require('./user'); // user.js 모델 가져옴
const Comment = require('./comment'); // comment.js 모델 가져옴

const env = process.env.NODE_ENV || 'development'; // 환경 설정 변수를 가져옵니다. .env 파일에 NODE_ENV가 없으면 'development'로 설정합니다.
const config = require('../config/config')[env]; // 설정 파일(config/config.json)에서 해당 환경의 설정을 가져옵니다.(6라인에서 설정한 NODE_ENV or 'development')
const db = {}; // 데이터베이스 모델 객체를 담을 빈 객체를 생성합니다.

const sequelize = new Sequelize(config.database, config.username, config.password, config); // Sequelize를 사용하여 데이터베이스에 연결합니다.(config/config.json의 development{database, username, password, config})
console.log("models/index.js db: ",db);
db.sequelize = sequelize; // db 객체에 Sequelize 객체를 추가합니다.
db.User = User; // db 객체에 User 모델을 추가합니다.
db.Comment = Comment; // db 객체에 Comment 모델을 추가합니다.
console.log("models/index.js db: ",db);

User.initiate(sequelize); // User 모델의 초기화 메서드를 호출하여 모델을 설정합니다. (user.js파일의 initiate() 메서드 호출)
Comment.initiate(sequelize); // Comment 모델의 초기화 메서드를 호출하여 모델을 설정합니다. (comment.js파일의 initiate() 메서드 호출)

User.associate(db); // User 모델과 다른 모델 간의 관계를 설정하는 메서드를 호출합니다.
Comment.associate(db); // Comment 모델과 다른 모델 간의 관계를 설정하는 메서드를 호출합니다.

module.exports = db; // db 객체를 모듈로 내보냅니다.