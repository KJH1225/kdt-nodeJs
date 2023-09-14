const express = require('express');
const User = require('../models/user'); // User 모델 가져옴

const router = express.Router();

// 사용자 목록 조회 (Read)
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll(); // User.findAll()을 사용하여 모든 사용자 정보를 데이터베이스에서 읽어옵니다. (select * from User)
    res.render('sequelize', { users }); // sequelize.html 템플릿을 렌더링하고, 사용자 목록을 매개변수로 전달합니다.
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router; // 라우터를 모듈로 내보냅니다.