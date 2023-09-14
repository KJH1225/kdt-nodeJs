// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => { //id가 user-list인거 안의 tr들 전부 반복문 돌림 
  el.addEventListener('click', function () { //el은 tr이니까 클릭하면 
    const id = el.querySelector('td').textContent; //querySelector()는 중복된거 있을땐 처음거 가져와서 상수 id에 클릭한 tr의 첫 td의 textContent인 id값 넣음
    // console.log("tr클릭했을때 id", id);
    getComment(id); //getComment()함수 호출 (매개변수로 id)
  });
});

// 사용자 로딩
async function getUser() { //사용자 목록 새로고침
  try {
    const res = await axios.get('/users');
    console.log("getUser().res: ",res);
    const users = res.data;
    console.log("getUser().users: ",users);
    const tbody = document.querySelector('#user-list tbody'); //id가 user-list인거 밑의 tbody리턴
    tbody.innerHTML = ''; //다시 목록 불러오니까 비어있게 초기화?
    users.map(function (user) { //users 하나하나 user에 넣으면서 반복
      const row = document.createElement('tr'); //테이블 태그의 행인 tr생성
      row.addEventListener('click', () => { //tr에 클릭 이벤트 추가
        getComment(user.id);
      });
      // 로우 셀 추가
      let td = document.createElement('td'); //테이블 태그의 td(속성) 생성
      td.textContent = user.id; //td에 user.id 집어 넣기
      row.appendChild(td); //tr에 td넣기
      td = document.createElement('td'); //td 재선언
      td.textContent = user.name; //재선언한 td의 내용으로 user.name 넣기
      row.appendChild(td); //tr에 td넣기
      td = document.createElement('td'); //td 재선언
      td.textContent = user.age; //재선언한 td의 내용으로 user.age 넣기
      row.appendChild(td); //tr에 td넣기
      td = document.createElement('td'); //td 재선언
      td.textContent = user.married ? '기혼' : '미혼'; //재선언한 td의 내용으로 user.married가 true면 기혼 falue면 미혼 넣기
      row.appendChild(td); //tr에 td넣기
      tbody.appendChild(row); //tbody에 tr넣기
    });
  } catch (err) {
    console.error(err);
  }
}

// 댓글 로딩
async function getComment(id) { 
  try {
    const res = await axios.get(`/users/${id}/comments`);
    console.log("sequelize.js_댓글로딩_res: ",res);
    const comments = res.data;
    const tbody = document.querySelector('#comment-list tbody');
    tbody.innerHTML = ''; //댓글 목록 초기화
    comments.map(function (comment) { 
      // 로우 셀 추가
      const row = document.createElement('tr');
      let td = document.createElement('td');
      td.textContent = comment.id;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = comment.User.name;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = comment.comment; 
      row.appendChild(td);
      const edit = document.createElement('button');
      edit.textContent = '수정';
      edit.addEventListener('click', async () => { // 수정 클릭 시
        const newComment = prompt('바꿀 내용을 입력하세요');
        if (!newComment) {
          return alert('내용을 반드시 입력하셔야 합니다');
        }
        try {
          await axios.patch(`/comments/${comment.id}`, { comment: newComment });
          getComment(id);
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement('button');
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => { // 삭제 클릭 시
        try {
          await axios.delete(`/comments/${comment.id}`);
          getComment(id);
        } catch (err) {
          console.error(err);
        }
      });
      // 버튼 추가
      td = document.createElement('td');
      td.appendChild(edit);
      row.appendChild(td);
      td = document.createElement('td');
      td.appendChild(remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

// 사용자 등록 시
document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value;
  const married = e.target.married.checked;
  if (!name) {
    return alert('이름을 입력하세요');
  }
  if (!age) {
    return alert('나이를 입력하세요');
  }
  try {
    await axios.post('/users', { name, age, married });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = '';
  e.target.age.value = '';
  e.target.married.checked = false;
});

// 댓글 등록 시
document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = e.target.userid.value;
  const comment = e.target.comment.value;
  if (!id) {
    return alert('아이디를 입력하세요');
  }
  if (!comment) {
    return alert('댓글을 입력하세요');
  }
  try {
    await axios.post('/comments', { id, comment });
    getComment(id);
  } catch (err) {
    console.error(err);
  }
  e.target.userid.value = '';
  e.target.comment.value = '';
});
