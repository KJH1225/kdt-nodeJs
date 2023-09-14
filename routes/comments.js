const express = require('express');
const { Comment } = require('../models'); // Comment 모델 가져옴

const router = express.Router();

// 댓글 작성 (Create)
router.post('/', async (req, res, next) => {
  try {
    const comment = await Comment.create({ // Comment 모델을 사용하여 새 댓글을 생성합니다.
      commenter: req.body.id, // 요청 본문에서 사용자 ID 가져옴
      comment: req.body.comment, // 요청 본문에서 댓글 내용 가져옴
    });
    console.log(comment);
    res.status(201).json(comment); // 성공적으로 생성된 댓글을 응답으로 보냅니다.
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 댓글 수정 (Update) 및 삭제 (Delete)
router.route('/:id')
  .patch(async (req, res, next) => { // 댓글 수정 (Update)
    try {
      const result = await Comment.update({ // Comment 모델을 사용하여 댓글을 수정합니다.
        comment: req.body.comment, // 요청 본문에서 새로운 댓글 내용 가져옴
      }, {
        where: { id: req.params.id }, // 댓글 ID에 해당하는 댓글을 찾아 수정
      });
      res.json(result); // 수정 결과를 응답으로 보냅니다.
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => { // 댓글 삭제 (Delete)
    try {
      const result = await Comment.destroy({ // Comment 모델을 사용하여 댓글을 삭제합니다.
        where: { id: req.params.id } // 댓글 ID에 해당하는 댓글을 삭제
      });
      res.json(result); // 삭제 결과를 응답으로 보냅니다.
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router; // 라우터를 모듈로 내보냅니다.