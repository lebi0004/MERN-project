'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMe, logout as apiLogout } from '@/lib/authApi';
import { useRouter } from 'next/navigation';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Modal,
} from 'react-bootstrap';

type Supply = {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

// send cookies on cross-origin requests (login session cookie)
axios.defaults.withCredentials = true;

export default function Home() {
  const router = useRouter();

  // ------- auth state -------
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [me, setMe] = useState<{ id: string; email: string } | null>(null);

  // ------- supplies state -------
  const [supplies, setSupplies] = useState<Supply[]>([]);

  // add form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [supplier, setSupplier] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  // edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<Supply | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<number | ''>('');
  const [editUnit, setEditUnit] = useState('');
  const [editSupplier, setEditSupplier] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>('');

  // load supplies
  const load = async () => {
    const res = await axios.get<Supply[]>(`${API_URL}/supplies`);
    setSupplies(res.data);
  };

  // auth guard + initial load
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMe(); // { id, email } or 401
        setMe(data);
        await load();
      } catch {
        router.replace('/login');
        return;
      } finally {
        setCheckingAuth(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      await apiLogout();
    } finally {
      router.replace('/login');
    }
  };

  const clearForm = () => {
    setName('');
    setQuantity('');
    setUnit('');
    setSupplier('');
    setPrice('');
  };

  const addSupply = async () => {
    if (!name || quantity === '' || !unit || !supplier || price === '') return;
    await axios.post(`${API_URL}/supplies`, {
      name,
      quantity: Number(quantity),
      unit,
      supplier,
      price: Number(price),
    });
    clearForm();
    await load();
  };

  const deleteSupply = async (id: string) => {
    await axios.delete(`${API_URL}/supplies/${id}`);
    await load();
  };

  // --- Edit handlers ---
  const openEdit = (item: Supply) => {
    setEditing(item);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit);
    setEditSupplier(item.supplier);
    setEditPrice(item.price);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await axios.put(`${API_URL}/supplies/${editing._id}`, {
      name: editName,
      quantity: Number(editQuantity),
      unit: editUnit,
      supplier: editSupplier,
      price: Number(editPrice),
    });
    setShowEdit(false);
    setEditing(null);
    await load();
  };

  // while we check the session
  if (checkingAuth) {
    return (
      <Container className="py-5">
        <div className="text-center">Checking session…</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Top bar: who’s signed in + logout */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="mb-0">Dental Supplies</h1>
        <div className="d-flex align-items-center gap-3">
          {me && (
            <span className="text-muted small">
              Signed in as <strong>{me.email}</strong>
            </span>
          )}
          <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Add form */}
      <Row className="g-3 align-items-end mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control
              placeholder="e.g. Masks"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <InputGroup>
            <InputGroup.Text>Qty</InputGroup.Text>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <InputGroup>
            <InputGroup.Text>Unit</InputGroup.Text>
            <Form.Control
              placeholder="boxes / pcs"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>Supplier</InputGroup.Text>
            <Form.Control
              placeholder="e.g. Dental Depot"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button onClick={addSupply}>Add Supply</Button>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Supplier</th>
            <th>Price</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.quantity}</td>
              <td>{s.unit}</td>
              <td>{s.supplier}</td>
              <td>{s.price.toFixed(2)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => openEdit(s)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSupply(s._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {supplies.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No supplies yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Supply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>Name</InputGroup.Text>
                <Form.Control
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>Qty</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={editQuantity}
                  onChange={(e) =>
                    setEditQuantity(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>Unit</InputGroup.Text>
                <Form.Control
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>Supplier</InputGroup.Text>
                <Form.Control
                  value={editSupplier}
                  onChange={(e) => setEditSupplier(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
