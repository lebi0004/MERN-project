'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(null);
    try {
      const data = await register(email, password);
      // backend sends: { id, email, message }
      setOk(data?.message ?? 'Account created. You can now log in.');
      setEmail('');
      setPassword('');
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Create account</h2>

              {ok && (
                <Alert variant="success" onClose={() => setOk(null)} dismissible>
                  {ok}
                </Alert>
              )}
              {err && (
                <Alert variant="danger" onClose={() => setErr(null)} dismissible>
                  {err}
                </Alert>
              )}

              <Form onSubmit={doRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Registering…' : 'Register'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => router.push('/login')}
                  >
                    Back to Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
