import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button, ListGroup, Row, Col } from "react-bootstrap";
import axios from "axios";

function AdminDepartmentDetail() {
  const { id } = useParams();

  const [department, setDepartment] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/departments/get-one/${id}`
        );
        console.log("Data nhận được:", response.data.oneDepartment);
        setDepartment(response.data.oneDepartment);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartment();
  }, [id]);
  return (
    <div>
      <Container className="mt-5 mb-5">
        <h1 className="mb-4">
          <strong>{department.name}</strong>
        </h1>

        <Row>
          {/* Người trong phòng ban */}
          {/* Người trong phòng ban */}
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-people"></i> Người trong phòng ban
                </h5>
              </Card.Header>
              <Card.Body>
                {!department.users || department.users.length === 0 ? (
                  <p className="text-muted">
                    <i className="bi bi-emoji-frown"></i> Chưa có người nào
                    trong phòng ban này.
                  </p>
                ) : (
                  <ListGroup>
                    {department.users.map((user) => (
                      <ListGroup.Item key={user._id}>
                        <strong>{user.name}</strong>{" "}
                        <span className="text-muted">({user.email})</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Danh sách phòng ban con */}
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-door-open"></i> Danh sách phòng ban con
                </h5>
              </Card.Header>
              <Card.Body>
                {!department.children || department.children.length === 0 ? (
                  <p className="text-muted">
                    <i className="bi bi-emoji-frown"></i> Không có phòng ban con
                    nào.
                  </p>
                ) : (
                  <ListGroup>
                    {department.children.map((child) => (
                      <ListGroup.Item key={child._id}>
                        <strong>{child.name}</strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quay lại danh sách phòng ban */}
        <div className="mt-4">
          <Link to="/admin/departments" className="btn btn-primary">
            Quay lại danh sách phòng ban
          </Link>
        </div>
      </Container>
      );
    </div>
  );
}

export default AdminDepartmentDetail;
