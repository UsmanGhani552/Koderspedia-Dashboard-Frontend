import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import InvoiceService from "../services/invoiceService";
import favicon from "../otherImages/favicon.svg";

const InvoiceDownloader = ({ invoiceId }) => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const invoiceRef = useRef();
    const html2pdfRef = useRef(null); // <- store preloaded library

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await InvoiceService.getInvoice(invoiceId);
                setInvoiceData(response.data.data.invoice);
            } catch (err) {
                console.error("Error fetching invoice:", err);
            }
        };

        fetchInvoice();

        // Preload html2pdf.js in background
        import("html2pdf.js").then((mod) => {
            html2pdfRef.current = mod.default;
        });
    }, [invoiceId]);

    const handleDownload = async () => {
        if (!invoiceData || !html2pdfRef.current) return;

        setIsDownloading(true);
        setShowInvoice(true);

        setTimeout(() => {
            html2pdfRef.current()
                .set({
                    filename: `invoice_${invoiceData.id}.pdf`,
                    margin: 10,
                    html2canvas: {
                        scale: 1.5,
                        useCORS: true,
                        logging: false,
                    },
                    jsPDF: { unit: "pt", format: "a4" },
                })
                .from(invoiceRef.current)
                .save()
                .finally(() => {
                    setIsDownloading(false);
                    setShowInvoice(false);
                });
        }, 100);
    };

    if (!invoiceData) return null;

    const dueDate = new Date(invoiceData.created_at);
    dueDate.setDate(dueDate.getDate() + 7);

    return (
        <>
            <Icon
                icon={isDownloading ? "eos-icons:loading" : "material-symbols:sim-card-download"}
                onClick={handleDownload}
                width="24"
                height="24"
                className="cursor-pointer"
                title="Download Invoice"
            />

            {showInvoice && (
                <div className="invoice-box" style={{ display: "none" }}>
                    <div
                        ref={invoiceRef}
                        style={{ padding: "30px", width: "800px", fontSize: "14px", fontFamily: "sans-serif" }}
                    >
                        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                            <img
                                src={favicon}
                                alt="Logo"
                                style={{ height: "60px", width: '60px', objectFit: 'contain' }}
                            />
                            <h4 style={{ fontFamily: "Urbanist", fontSize: '20px', marginRight: "20px" }}>
                                INVOICE #{invoiceData.id}
                                {invoiceData.status === "1" ? (
                                    <span className="rounded-pill bg-success ms-2" style={badgeStyle}>Paid</span>
                                ) : (
                                    <span className="badge rounded-pill bg-warning ms-2" style={badgeStyle}>Unpaid</span>
                                )}
                            </h4>
                        </div>

                        <div style={billToStyle}>
                            <div>
                                <p><strong>BILLED TO:</strong></p>
                                <p>{invoiceData?.client?.name}</p>
                                <p>{invoiceData?.client?.phone}</p>
                            </div>
                            <div>
                                <p>Invoice No. {invoiceData?.id}</p>
                                <p>{formatDate(invoiceData?.created_at)}</p>
                            </div>
                        </div>
                        <table className="table table-bordered table-striped text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th className="text-start">Item</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-center">Unit</th>
                                    <th className="text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-start">{invoiceData.title}</td>
                                    <td>1</td>
                                    <td>{formatCurrency(invoiceData.price)}</td>
                                    <td className="text-center">{formatCurrency(invoiceData.price)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            marginTop: "20px",
                            marginRight: "30px"
                        }}>
                            <div style={rightRow}><strong>Subtotal:</strong> <span>{formatCurrency(invoiceData.price)}</span></div>
                            <div style={rightRow}><strong>Tip :</strong> <span>{formatCurrency(invoiceData.tip)}</span></div>
                            <div style={{ ...rightRow, fontWeight: 700, fontSize: "18px", borderTop: "1px solid #000", paddingTop: "10px" }}>
                                <strong>Total:</strong> <span>{formatCurrency(Number(invoiceData.price) + Number(invoiceData.tip))}</span>
                            </div>
                        </div>

                        <p style={{ marginTop: "20px", fontSize: "20px", color: "#000" }}>Thank you!</p>

                        <div style={paymentInfoStyle}>
                            <div>
                                <h6><strong>PAYMENT INFORMATION</strong></h6>
                                <p><strong>Business Name:</strong> Koderspedia</p>
                                <p><strong>Bank Name:</strong> Chase Bank</p>
                                <p><strong>Routing No:</strong> 322271627</p>
                                <p><strong>Account No:</strong> 775910729</p>
                                <p><strong>Account Holder Name:</strong> Koderspedia</p>
                                {/* <p><strong>Pay by:</strong> {formatDate(dueDate)}</p> */}
                            </div>
                            <div style={{ textAlign: "right", marginRight: "50px", fontWeight: 600 }}>
                                <p>
                                    <img src={favicon} alt="Logo" className="name invoice-logo" style={{ width: '40%' }} />
                                </p>
                            </div>
                        </div>
                        {/* <span className="address" style={{ fontSize: '11px' }}>{invoiceData.brand.address}</span> */}
                        <div className="text-center">
                            <span style={{ fontSize: '15px' }}>{invoiceData.brand.address}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Inline style constants for cleaner JSX
const badgeStyle = {
    fontSize: '1rem',
    display: "inline-flex",
    alignItems: 'center',
    padding: "0.05rem 0.5rem 0.45rem",
    color: '#fff',
    fontWeight: '700'
};

const billToStyle = {
    fontSize: "14px",
    marginBottom: "50px",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between"
};

const rightRow = {
    display: "flex",
    justifyContent: "space-between",
    width: "250px",
    marginBottom: "6px",
    color: "#000"
};

const paymentInfoStyle = {
    fontSize: "14px",
    marginTop: "30px",
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between"
};

export default InvoiceDownloader;
