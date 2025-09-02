'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';                // ← removed register
import Link from 'next/link';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      await login(email, password);
      router.push('/supplies'); // go to main page after login
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-center">Sign in</h3>

              {msg && (
                <Alert variant="success" onClose={() => setMsg(null)} dismissible>
                  {msg}
                </Alert>
              )}
              {err && (
                <Alert variant="danger" onClose={() => setErr(null)} dismissible>
                  {err}
                </Alert>
              )}

              <Form onSubmit={doLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@clinic.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Login'}
                  </Button>

                  {/* Use a real navigation to /register */}
                  <Link
                    href="/register"
                    className="btn btn-outline-secondary w-100"
                  >
                    Register new account
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
