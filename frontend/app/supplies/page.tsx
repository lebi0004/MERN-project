'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMe, logout as apiLogout } from '@/lib/authApi';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Modal,
  Alert,
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

export default function SuppliesPage() {
  const router = useRouter();

  // ---------- supplies ----------
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const load = async () => {
    const res = await axios.get<Supply[]>(`${API_URL}/supplies`, {
      withCredentials: true,
    });
    setSupplies(res.data);
  };
  useEffect(() => {
    load();
  }, []);

  // ---------- add form ----------
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [supplier, setSupplier] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const clearAddForm = () => {
    setName('');
    setQuantity('');
    setUnit('');
    setSupplier('');
    setPrice('');
  };

  const addSupply = async () => {
    if (!name || quantity === '' || !unit || !supplier || price === '') return;
    await axios.post(
      `${API_URL}/supplies`,
      {
        name,
        quantity: Number(quantity),
        unit,
        supplier,
        price: Number(price),
      },
      { withCredentials: true }
    );
    clearAddForm();
    await load();
  };

  // ---------- edit modal ----------
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<Supply | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<number | ''>('');
  const [editUnit, setEditUnit] = useState('');
  const [editSupplier, setEditSupplier] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>('');

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
    await axios.put(
      `${API_URL}/supplies/${editing._id}`,
      {
        name: editName,
        quantity: Number(editQuantity),
        unit: editUnit,
        supplier: editSupplier,
        price: Number(editPrice),
      },
      { withCredentials: true }
    );
    setShowEdit(false);
    setEditing(null);
    await load();
  };

  const deleteSupply = async (id: string) => {
    await axios.delete(`${API_URL}/supplies/${id}`, { withCredentials: true });
    await load();
  };

  // ---------- auth banner ----------
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authErr, setAuthErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe(); // expects { id, email }
        setUserEmail(me.email);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          router.push('/login');
        } else {
          setAuthErr('Failed to determine signed-in user.');
        }
      }
    })();
  }, [router]);

  const logout = async () => {
    await apiLogout();
    router.push('/login');
  };

  // ---------- FILTERS (apply on click) ----------
  // typing inputs
  const [nameFilterInput, setNameFilterInput] = useState('');
  const [supplierFilterInput, setSupplierFilterInput] = useState('');
  // applied filters (used by table)
  const [nameFilter, setNameFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  const applyFilters = () => {
    setNameFilter(nameFilterInput);
    setSupplierFilter(supplierFilterInput);
  };
  const clearFilters = () => {
    setNameFilterInput('');
    setSupplierFilterInput('');
    setNameFilter('');
    setSupplierFilter('');
  };

  const filtered = useMemo(() => {
    const nf = nameFilter.trim().toLowerCase();
    const sf = supplierFilter.trim().toLowerCase();
    return supplies.filter((s) => {
      const okName = nf ? s.name.toLowerCase().includes(nf) : true;
      const okSupplier = sf ? s.supplier.toLowerCase().includes(sf) : true;
      return okName && okSupplier;
    });
  }, [supplies, nameFilter, supplierFilter]);

  return (
    <Container className="py-4">
      <Row className="align-items-center">
        <Col>
          <h1 className="mb-3">Dental Supplies</h1>
        </Col>
        <Col className="text-end">
          {userEmail && (
            <div className="d-inline-flex align-items-center gap-3">
              <span className="text-muted">Signed in as <strong>{userEmail}</strong></span>
              <Button variant="outline-secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {authErr && (
        <Alert variant="warning" className="mb-3">
          {authErr}
        </Alert>
      )}

      {/* ---- ADD FORM ---- */}
      <Row className="g-2 align-items-end mb-3">
  <Col md={3}>
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

  {/* Button fits into remaining 1 column */}
  <Col md={1} className="d-grid">
    <Button className="w-100 text-nowrap" onClick={addSupply}>
      Add Supply
    </Button>
  </Col>
</Row>


      {/* ---- FILTERS (Name + Supplier, apply on click) ---- */}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Filter: Name</InputGroup.Text>
            <Form.Control
              placeholder="Mask"
              value={nameFilterInput}
              onChange={(e) => setNameFilterInput(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Supplier</InputGroup.Text>
            <Form.Control
              placeholder="Dental Depot"
              value={supplierFilterInput}
              onChange={(e) => setSupplierFilterInput(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline-secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* ---- TABLE ---- */}
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
          {filtered.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.quantity}</td>
              <td>{s.unit}</td>
              <td>{s.supplier}</td>
              <td>{s.price.toFixed(2)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openEdit(s)}
                  >
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
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No supplies found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ---- EDIT MODAL ---- */}
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
