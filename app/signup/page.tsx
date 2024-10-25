"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 리다이렉트 처리
import toastr from '@/lib/toastrConfig'; // toastr 설정 가져오기

export default function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // 리다이렉트 처리를 위한 useRouter 사용

  const handleSignup = async () => {
    if (!username || !name || !password) {
      setMessage("All fields are required");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, name, password }),
    });

    const data = await response.json();
    if (response.ok) {
      toastr.success('Signup successful!', 'Success');
      router.push("/login"); // 회원가입 성공 시 로그인 페이지로 리다이렉트
    } else {
      toastr.error(data.error, 'Error');
      setMessage(data.error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <div className="mb-4">
        <input
          className="border border-gray-300 p-2 rounded w-full mb-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-300 p-2 rounded w-full mb-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 p-2 rounded w-full mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
