import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET 요청 처리 - 모든 할 일 가져오기
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    return NextResponse.json(rows);  // MySQL에서 가져온 할 일 목록을 JSON으로 반환
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

// POST 요청 처리 - 새로운 할 일 추가
export async function POST(request: Request) {
  try {
    const { task } = await request.json();
    if (!task) return NextResponse.json({ error: 'Task is required' }, { status: 400 });

    const [result]: any = await pool.query('INSERT INTO todos (task) VALUES (?)', [task]);
    const newTodo = { id: result.insertId, task };
    
    return NextResponse.json(newTodo);  // 추가된 할 일을 반환
  } catch (error) {
    console.error('Error adding todo:', error);
    return NextResponse.json({ error: 'Error adding todo' }, { status: 500 });
  }
}

// PUT 요청 처리 - 할 일 수정
export async function PUT(request: Request) {
  try {
    const { id, task } = await request.json();
    if (!id || !task) return NextResponse.json({ error: 'ID and task are required' }, { status: 400 });

    await pool.query('UPDATE todos SET task = ? WHERE id = ?', [task, id]);
    return NextResponse.json({ id, task });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Error updating todo' }, { status: 500 });
  }
}

// DELETE 요청 처리 - 할 일 삭제
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Error deleting todo' }, { status: 500 });
  }
}
