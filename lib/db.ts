import mysql from 'mysql2/promise';

// MySQL 데이터베이스에 연결 설정
const pool = mysql.createPool({
  host: 'localhost',   // MySQL 서버 주소
  user: 'root',   // MySQL 사용자 이름
  password: '',  // MySQL 비밀번호
  database: 'nextjs_todos',  // 사용할 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
