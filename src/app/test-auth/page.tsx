"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestAuth() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');

  const testSignup = async () => {
    try {
      setResult('Testing...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResult(`Success: ${userCredential.user.email}`);
    } catch (error: any) {
      setResult(`Error: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Firebase Auth Test</h1>
      <div className="space-y-4 max-w-md">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <Button onClick={testSignup}>Test Signup</Button>
        <div className="p-4 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );
}