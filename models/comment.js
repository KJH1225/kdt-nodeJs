const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({ // Comment 테이블의 컬럼에 대한 정의를 수행합니다.
      comment: { // comment 속성의 정의
        type: Sequelize.STRING(100), // 문자열 형태로 최대 100자까지 허용
        allowNull: false, // null 값 허용 안 함
      },
      created_at: {
        type: Sequelize.DATE, // 날짜 및 시간 형태
        allowNull: true, // null 값 허용
        defaultValue: Sequelize.NOW, // 현재 날짜 및 시간을 기본값으로 설정
      },
    }, {
      sequelize, // Sequelize 객체를 전달하여 모델과 데이터베이스 연결을 설정합니다.
      timestamps: false, // 행 생성 및 수정 시간 자동 입력 비활성화
      modelName: 'Comment', // 모델의 이름 설정
      tableName: 'comments', // 테이블의 이름 설정
      paranoid: false, // 소프트 삭제 비활성화
      charset: 'utf8mb4', // 문자 인코딩 설정 (utf8mb4는 이모지를 지원합니다)
      collate: 'utf8mb4_general_ci', // 문자 비교 설정
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
    // Comment 모델과 User 모델 간의 관계 설정
    // Comment 모델은 User 모델에 속하며, commenter 컬럼을 외래 키로 사용합니다.
    // targetKey로 User 모델의 id 컬럼을 사용합니다.
  }
}

module.exports = Comment; // Comment 모델을 모듈로 내보냅니다.