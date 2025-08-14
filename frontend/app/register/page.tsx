'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Register failed');
      router.push('/');
    } catch (e: any) {
      setErr(e.message ?? 'Register failed');
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 540 }}>
      <h2 className="mb-4 text-center">Create account</h2>
      {err && <Alert variant="danger" onClose={() => setErr(null)} dismissible>{err}</Alert>}
      <Form onSubmit={submit}>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Col>
          <Col xs={12}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Col>
          <Col xs={12} className="d-grid">
            <Button type="submit">Register</Button>
          </Col>
          <Col xs={12} className="d-grid">
            <Button variant="outline-secondary" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
