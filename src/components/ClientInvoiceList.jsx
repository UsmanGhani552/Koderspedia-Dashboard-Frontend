import { Icon } from '@iconify/react/dist/iconify.js'
import DefaultAvatar from '../otherImages/default.png';
import { useNavigate } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteInvoice, fetchInvoices } from '../store/slices/invoiceSlice';
import Swal from 'sweetalert2';
import DeleteConfirmButton from './DeleteConfirmButton';
import InvoiceDownloader from '../common/InvoiceDownloader';

const ClientInvoiceList = () => {
  const dispatch = useDispatch();
  const [filter] = useState('monthly');
  const navigate = useNavigate();
  const [downloading] = useState(null);
  const { invoices } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch])

  const handleEditPackage = (rowData) => {
    navigate(`/edit-invoice/${rowData.id}`, { state: { invoice: rowData } });
  };

  // Flatten the data for better searching
  const transformedInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.map(invoice => ({
      ...invoice,
      date: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A',
      clientName: invoice.client?.name || 'No Name',
      clientImage: invoice.client?.image_url || DefaultAvatar,
      createdByName: invoice.created_by?.name || "N/A",
      statusText: invoice.status == 1 ? 'paid' : 'pending',
    }))
  }, [invoices])

  const filteredData = useMemo(() => {
    if (filter === 'monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return transformedInvoices.filter(pkg => {
        const rowDate = new Date(pkg.created_at);
        return rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear;
      });
    }
    return transformedInvoices;
  }, [filter, transformedInvoices]);


  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.title.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-name val-${safeVal} d-flex align-items-center gap-8`}>
              {rowData.title}
            </div>
          );
        }
      }
    },
    {
      name: 'clientName',
      label: 'Client',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.clientName.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-name val-${safeVal} d-flex align-items-center gap-8`}>
              <img
                style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                src={rowData.clientImage}
                alt="client"
              />
              {rowData.clientName}
            </div>
          );
        }
      }
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const price = parseFloat(rowData.price) || 0;
          const safeVal = price.toFixed(2).replace('.', '-');
          return (
            <span className={`col-price val-${safeVal} font-bold`}>
              ${price.toFixed(0)}
            </span>
          );
        }
      }
    },
    {
      name: 'statusText',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          let badgeClass = rowData.status == 1 ? 'badge bg-success text-white' : 'badge bg-warning';
          return (
            <span className={badgeClass}>
              {rowData.statusText}
            </span>
          );
        }
      }
    },
    {
      name: 'date',
      label: 'Created At',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.date.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-date val-${safeVal} text-gray-600`}>
              {rowData.date}
            </span>
          );
        }
      }
    },
    {
      name: 'createdByName',
      label: 'Created By',
      options: {
        filter: true,
        sort: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = String(rowData.createdByName).toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-date val-${safeVal} text-gray-600`}>
              {rowData.createdByName}
            </span>
          );
        }
      }
    },
    {
      name: 'links',
      label: 'Links',
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const isDownloading = downloading === rowData.id;

          const handleInvoiceLink = () => {
            const fullLink = `${window.location.origin}/invoice-detail/${rowData.id}`;
            navigator.clipboard.writeText(fullLink)
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Copied!',
                  text: 'Invoice link copied to clipboard.',
                  timer: 2000,
                  showConfirmButton: false,
                });
              })
              .catch(err => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Failed to copy invoice link.',
                });
                console.error("Clipboard copy failed:", err);
              });
          };

          return (
            <div className="flex gap-2 invoice-link">
              <InvoiceDownloader invoiceId={rowData.id} />
              <Icon
                onClick={handleInvoiceLink}
                className="copy-invoice hover:cursor-pointer"
                icon="material-symbols-light:content-copy-rounded"
                width="24"
                height="24"
              />
            </div>
          );
        },
      },
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <div className='d-flex'>
              <Icon
                onClick={() => handleEditPackage(rowData)}
                className="editBtn hover: cursor-pointer"
                icon="line-md:edit"
                width="24"
                height="24"
              />
              <DeleteConfirmButton
                item={{ id: rowData.id, name: rowData.title }}
                deleteAction={deleteInvoice}
                className="deleteBtn hover:cursor-pointer"
                title="Delete Invoice"
              >
                <Icon icon="material-symbols:delete-outline" width="24" height="24" />
              </DeleteConfirmButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: 'none',
    rowsPerPage: 10,
    responsive: 'standard',
    elevation: 0,
    print: false,
    download: false,
    viewColumns: false,
    filter: false,
    search: true,
    searchPlaceholder: 'Search by any field...',
    customSearch: (searchQuery, currentRow, columns) => {
      const searchValue = searchQuery.toLowerCase();
      return Object.values(currentRow).some(value =>
        String(value).toLowerCase().includes(searchValue)
      );
    }
  };

  return (
    <>
      <h2 className='fs-2 mt-40'>Client Invoices List This Month</h2>
      {/* <DynamicTable
        columns={invoiceColumns}
        data={invoiceData}
        keyField="id"
        // onRowClick={handleRowClick}
        className="overflow-hidden "
    /> */}
      <MUIDataTable
        data={filteredData}
        columns={columns}
        options={options}
        className="overflow-hidden packageTable"
      />
    </>
  )
}

export default ClientInvoiceList