import React from "react";

const InvoicePaymentTable = ({ invoiceData, tipAmount }) => {
  // Format currency
  console.log("Invoice Data:", invoiceData);
  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const total = (Number(invoiceData.price) + Number(tipAmount || 0)).toFixed(2);
  // Calculate due date (7 days from invoice date)
  const dueDate = new Date(invoiceData.created_at);
  dueDate.setDate(dueDate.getDate() + 7);
  return (
    <div className="invoice-box">
      <div className="invoice-header">
        <img src={invoiceData.brand.logo_mini_url} alt="Logo" className="invoice-logo" style={{ width: '10%' }} />
        <h2 className="invoice-title d-flex align-items-center gap-2">
          INVOICE #{invoiceData.id}
          {invoiceData.status == 1 && (
            <span className="badge rounded-pill bg-success ms-2" style={{
              fontSize: '1rem',
              padding: '0.25rem 0.5rem'
            }}>
              Paid
            </span>
          )}
        </h2>
      </div>

      <div className="invoice-bill-to">
        <div className="invoice-to">
          <p><strong>BILLED TO:</strong></p>
          <p>{invoiceData.client.name}</p>
          <p>{invoiceData.client.phone}</p>
          {/* <p>{invoiceData.client.address || "Address not specified"}</p> */}
        </div>

        <div className="invoice-meta">
          <p>Invoice No. {invoiceData.id}</p>
          <p>{formatDate(invoiceData.created_at)}</p>
        </div>
      </div>

      <table className="table table-bordered table-striped text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th className="text-start">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-center">Unit</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-start">{invoiceData.title}</td>
            <td>1</td>
            <td>{formatCurrency(invoiceData.price)}</td>
            <td className="text-end">{formatCurrency(invoiceData.price)}</td>
          </tr>
        </tbody>
      </table>


      <div className="invoice-totals">
        <div><strong>Subtotal</strong><span>{formatCurrency(invoiceData.price)}</span></div>
        <div><strong>Tip Amount</strong><span>
          {invoiceData.status == 1
            ? formatCurrency(invoiceData.tip || 0)
            : formatCurrency(tipAmount || 0)}
        </span></div>
        <div className="total"><strong>Total</strong><span>{formatCurrency(total)}</span></div>
      </div>

      <p className="thankyou">Thank you!</p>

      <div className="invoice-payment-info">
        <div>
          <h6><strong>PAYMENT INFORMATION</strong></h6>
          <p><strong>Business Name:</strong> Koderspedia</p>
          <p><strong>Bank Name:</strong> Chase Bank</p>
          <p><strong>Routing No:</strong> 322271627</p>
          <p><strong>Account No:</strong> 775910729</p>
          <p><strong>Account Holder Name:</strong> Koderspedia</p>
          {/* <p><strong>Pay by:</strong> {formatDate(dueDate)}</p> */}
        </div>

        <div className="invoice-sign">
          <p>
            <img src={invoiceData.brand.logo_mini_url} alt="Logo" className="name invoice-logo" style={{ width: '40%' }} />
          </p>
        </div>
      </div>
      <div className="text-center">
        <span style={{ fontSize: '15px' }}>{invoiceData.brand.address}</span>
      </div>
    </div>
  );
};

export default InvoicePaymentTable;