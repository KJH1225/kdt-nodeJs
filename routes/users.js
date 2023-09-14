const express = require('express');
const User = require('../models/user'); // User 모델 가져옴
const Comment = require('../models/comment'); // Comment 모델 가져옴

const router = express.Router();

// 사용자 목록 조회 (Read) 및 사용자 추가 (Create)
router.route('/')
  .get(async (req, res, next) => { // GET 요청에 대한 처리
    try {
      const users = await User.findAll(); // User 모델을 사용하여 모든 사용자 정보를 데이터베이스에서 조회합니다.
      res.json(users); // 조회된 사용자 정보를 JSON 형태로 응답합니다.
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => { // POST 요청에 대한 처리
    try {
      const user = await User.create({ // User 모델을 사용하여 사용자를 데이터베이스에 추가합니다.
        name: req.body.name, // 요청 본문에서 이름 가져옴
        age: req.body.age, // 요청 본문에서 나이 가져옴
        married: req.body.married, // 요청 본문에서 결혼 여부 가져옴
      });
      console.log(user);
      res.status(201).json(user); // 사용자 추가 성공 시 201 Created 상태 코드와 사용자 정보를 응답합니다.
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

// 특정 사용자의 댓글 목록 조회 (Read)
router.get('/:id/comments', async (req, res, next) => { // GET 요청에 대한 처리
  console.log("댓글조회 req:", req);
  try {
    const comments = await Comment.findAll({ // Comment 모델을 사용하여 모든 댓글 정보를 데이터베이스에서 조회합니다.
      include: {
        model: User, // User 모델과 조인
        where: { id: req.params.id }, //params: { id: '3' },    사용자 ID에 해당하는 댓글만 필터링 
      },
    });
    console.log(comments);
    res.json(comments); // 조회된 댓글 정보를 JSON 형태로 응답합니다.
    console.log("댓글 목록 조회 comments: ", comments); //
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router; // 라우터를 모듈로 내보냅니다.