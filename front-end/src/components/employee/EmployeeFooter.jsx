import React from "react";

function EmployeeFooter() {
  return (
    <div>
      <div
        className="pb-5"
        style={{
          borderTop: "1px solid rgba(0, 0, 0, 0.2)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <div className="row mt-5">
              <div className="col-md-3">
                <div style={{ width: "200px" }}>
                  <h1
                    className="text-start"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "20px",
                    }}
                  >
                    Liên hệ
                  </h1>
                  <p className="text-start">Kurehakisaya@gmail.com</p>
                  <p className="text-start">0999333444</p>
                  <p className="text-start">
                    212, nowhere streets from Hoa Lac
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ width: "200px" }}>
                  <h1
                    className="text-start"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "20px",
                    }}
                  >
                    Chính Sách
                  </h1>
                  <p className="text-start">Chính sách bảo mật</p>
                  <p className="text-start">Điều khoản dịch vụ</p>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ width: "200px" }}>
                  <h1
                    className="text-end"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "20px",
                    }}
                  >
                    Công ty
                  </h1>
                  <p className="text-end">Về VNPT</p>
                  <p className="text-end">Cơ hội việc làm</p>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ width: "200px" }}>
                  <h1
                    className="text-end"
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "20px",
                    }}
                  >
                    Mạng xã hội
                  </h1>
                  <p className="text-end">Facebook</p>
                  <p className="text-end">Instagram</p>
                  <p className="text-end">Threads</p>
                  <p className="text-end">Youtube</p>
                </div>
              </div>
            </div>

            <h1 style={{ fontWeight: "bold" }}>SDN302</h1>
            <p>Copyright &copy; 2023</p>
          </div>
        </div>
      </div>
      );
    </div>
  );
}

export default EmployeeFooter;
