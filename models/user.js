// Sequelize를 사용하여 User 모델을 정의하는 부분
//Sequelize를 사용하여 User 모델을 정의하고 초기화합니다. 모델에는 사용자 데이터에 대한 정의와 데이터베이스와의 연결 설정이 포함되어 있습니다. 또한 User 모델과 Comment 모델 간의 관계도 설정

const Sequelize = require('sequelize');

class User extends Sequelize.Model { // Sequelize.Model을 상속받아 User 클래스를 만듭니다.
  static initiate(sequelize) {
    User.init({ // User 모델의 초기화 메서드를 호출하여 사용자 테이블의 컬럼에 대한 정의를 수행합니다.
      name: {
        type: Sequelize.STRING(20), // 문자열 형태로 최대 20자까지 허용합니다.
        allowNull: false, // null 값 허용 안 함
        unique: true, // 고유한 값이어야 합니다.
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED, // 부호 없는 정수 형태
        allowNull: false, // null 값 허용 안 함
      },
      married: {
        type: Sequelize.BOOLEAN, // 부울 값 (true 또는 false)
        allowNull: false, // null 값 허용 안 함
      },
      comment: {
        type: Sequelize.TEXT, // 긴 텍스트 형태
        allowNull: true, // null 값 허용
      },
      created_at: {
        type: Sequelize.DATE, // 날짜 및 시간 형태
        allowNull: false,
        defaultValue: Sequelize.NOW, // 현재 날짜 및 시간을 기본값으로 설정
      },
    }, {
      sequelize, // Sequelize 객체를 전달하여 모델과 데이터베이스 연결을 설정합니다.
      timestamps: false, // 행 생성 및 수정 시간 자동 입력 비활성화
      underscored: false, // 스네이크 케이스 형식 사용 비활성화
      modelName: 'User', // 모델의 이름 설정
      tableName: 'users', // 테이블의 이름 설정
      paranoid: false, // 소프트 삭제 비활성화
      charset: 'utf8', // 문자 인코딩 설정
      collate: 'utf8_general_ci', // 문자 비교 설정
    });
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    // User 모델과 Comment 모델 간의 관계 설정
    // User 모델은 여러 개의 Comment를 가질 수 있으며, commenter 컬럼을 외래 키로 사용합니다.
    // sourceKey로 User 모델의 id 컬럼을 사용합니다.
  }
};

module.exports = User; // User 모델을 모듈로 내보냅니다.