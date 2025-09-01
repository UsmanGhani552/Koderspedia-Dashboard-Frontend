// components/ClientPackageDrawer.jsx
import React from "react";
import { Offcanvas, Form, Button, Image } from "react-bootstrap";
import DefaultAvatar from "../otherImages/default.png";
import { useDispatch } from "react-redux";
import {
  assignPackage,
  sanitizePackages,
} from "../store/slices/assignedPackagesSlice";
import Swal from "sweetalert2";

const PackageSidebar = ({ show, onClose, data }) => {
  const dispatch = useDispatch();
  console.log("data", data);

  // utils in the same file (or move to src/utils/strings.ts and import)
  const stripHtml = (html = "") => {
    // turn common block/line-break tags into newlines
    const withBreaks = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n");
    // remove all remaining tags
    const noTags = withBreaks.replace(/<[^>]+>/g, "");
    // decode a few common entities (lightweight; use a lib if you need full coverage)
    const decoded = noTags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
        String.fromCharCode(parseInt(n, 16))
      );
    // tidy up whitespace
    return decoded
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // dispatch(sanitizePackages());
      await dispatch(assignPackage(data.id)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Package assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      onClose();
    } catch (error) {
      Swal.fire("Error", error || "Failed to assign package", "error");
    }
  };
  if (!data) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      className="drawerSidebar"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fw-bold">Package Details</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="text-center mb-4">
          <Image
            src={data.packageImage || DefaultAvatar}
            roundedCircle
            height="120"
            width="120"
            alt="Package"
          />
        </div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Package Name</Form.Label>
            <Form.Control type="text" value={data.name} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={stripHtml(data.description)}
              readOnly
              style={{ minHeight: "100px", padding: "10px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="text" value={data.price} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="text" value={data.date} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" value={data.category} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deliverables</Form.Label>
            <Form.Control
              type="text"
              value={data.deliverables.map((item) => item.name).join(", ")}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control type="text" value={data.additional_notes} readOnly />
          </Form.Group>
          {data.document_url !== null && (
            <Form.Group className="mb-5">
              <Form.Label>Document</Form.Label>
              <div className="mainBox d-flex align-items-center">
                <Form.Control className="downloadField" type="text" value={data.document_url} readOnly />
                <div className="buttonDiv">
                  <a
                    href={data.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className=" bg-primary text-white"
                    style={{ padding: "10px", fontSize: "15px", width: "140px", textAlign: 'center', borderRadius: "7px", }}
                  >
                    View Document
                  </a>
                </div>
              </div>
            </Form.Group>
          )}

          <div className="text-end  d-flex justify-content-end gap-10 absolute">
            <Button
              className="btn bg-secondary d-flex gap-10 drawerBtn"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              className="btn bg-primary text-white d-flex gap-10 drawerBtn"
            >
              Add Package
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PackageSidebar;
