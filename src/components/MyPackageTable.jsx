import React, {  useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { useDispatch, useSelector } from 'react-redux';
import DefaultAvatar from '../otherImages/default.png';
import LoadingSpinner from '../common/LoadingSpinner';
import { fetchAssignedPackages } from '../store/slices/assignedPackagesSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyPackageTable = () => {
  const { user } = useSelector((state) => state.auth);
  const id = user?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignedPackages, loading, error } = useSelector((state) => state.assignedPackages);
  useEffect(() => {
    const fetchAndSanitize = async () => {
      dispatch(fetchAssignedPackages(id));
    };

    fetchAndSanitize();
  }, [dispatch, id]);

  const handlePayNow = (invoice) => {
    if (!invoice || invoice.id == null) {
      Swal.fire({
        icon: 'info',
        title: 'Invoice Removed',
        text: 'This assignment has no invoice available.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });
      return;
    }
    navigate(`/invoice-detail/${invoice.id}`);
  };

  // Transform API data to match table structure
  const transformedData = assignedPackages.map(item => ({
    id: item?.id,
    packageName: item.package.name,
    packageImage: DefaultAvatar, // Using default avatar for all
    date: new Date(item.created_at).toLocaleDateString(),
    description: item.package.description,
    priceText: `$${parseFloat(item.package.price).toFixed(0)}`,
    packageDeliverable: item.package.deliverables.map(d => d.name),
    invoice: item.invoice,
    paymentStatus: getStatusText(item.status),
    rawStatus: item.status,
    packageDetails: item.package // Keep full package details for potential use
  }));

  function getStatusText(statusCode) {
    const statusMap = {
      '0': 'Pending',
      '1': 'Completed',
      '2': 'In Progress',
    };
    return statusMap[statusCode] || 'Unknown';
  }

  const statusColorMap = {
    'Pending': 'bg-warning',
    'Completed': 'bg-success',
    'In Progress': 'bg-info',
  };

  	  const htmlToText = (html = "") => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  };

  const columns = [
    {
      name: 'packageName',
      label: 'Package Name',
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = transformedData[tableMeta.rowIndex];
          const safeVal = value.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-packageName val-${safeVal} d-flex align-items-center gap-8`}>
              {value}
            </div>
          );
        }
      }
    },
    {
      name: "description",
      label: "Description",
      options: {
        customBodyRender: (value) => {
          const text = htmlToText(value);
          return (
            <div
              className="text-truncate d-inline-block"
              style={{
                maxWidth: 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={text} // hover to see full text
            >
              {text}
            </div>
          );
        },
      },
    },

    {
      name: 'packageDeliverable',
      label: 'Package Deliverables',
      options: {
        customBodyRender: (value) => {
          return (
            <div className="d-flex flex-wrap gap-1 justify-content-center">
              {value.map((item, index) => (
                <span key={index} className="badge bg-light text-dark">
                  {item}
                </span>
              ))}
            </div>
          );
        }
      }
    },
    {
      name: 'date',
      label: 'Assigned Date',
      options: {
        customBodyRender: (value) => {
          const safeVal = value.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-date val-${safeVal} text-gray-600`}>
              {value}
            </span>
          );
        }
      }
    },
    {
      name: 'paymentStatus',
      label: 'Status',
      options: {
        customBodyRender: (value) => {
          const colorClass = statusColorMap[value] || 'bg-secondary';
          return (
            <span className={`badge ${colorClass} text-white`}>
              {value}
            </span>
          );
        },
        filter: true,
        filterOptions: {
          names: ['All', 'Planning', 'In Progress', 'Completed'],
          logic(status, filterVal) {
            if (filterVal[0] === 'All') return false;
            return status !== filterVal[0];
          }
        }
      }
    },
    {
      name: 'actions',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const rowData = transformedData[dataIndex];
          console.log(rowData);
          return (
            <button
              onClick={() => handlePayNow(rowData.invoice)}
              className={`viewBtn hover: cursor-pointer`}
            >
              {rowData.paymentStatus === 'Completed' ? 'View Invoice' : 'Pay Now'}
            </button>
          );
        },
      }
    },
  ];

  const options = {
    setCellHeaderProps: () => ({
      style: {
        textAlign: 'center',
        fontWeight: 'bold'
      }
    }),
    setCellProps: () => ({
      style: {
        textAlign: 'center'
      }
    }),
    selectableRows: 'none',
    rowsPerPage: 10,
    responsive: 'standard',
    elevation: 0,
    print: false,
    download: false,
    viewColumns: false,
    filter: true,
    search: true,
    textLabels: {
      body: {
        noMatch: loading ? <LoadingSpinner /> : error || 'No packages assigned yet',
      }
    },
    customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
      return (
        <div style={{ marginTop: '40px' }}>
          <button onClick={() => applyNewFilters([])}>Reset Filters</button>
        </div>
      );
    }
  };

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>My Assigned Packages</h5>
        {/* <div className="filter-select">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="0">Pending</option>
            <option value="1">Completed</option>
            <option value="2">In Progress</option>
          </select>
        </div> */}
      </div>
      <div className="card-body">
        <MUIDataTable
          data={transformedData}
          columns={columns}
          options={options}
          className="overflow-hidden packageTable"
        />
      </div>
    </div>
  );
};

export default MyPackageTable;