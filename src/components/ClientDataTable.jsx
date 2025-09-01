import React, { useState, useMemo, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClient, fetchClients } from '../store/slices/clientSlice';
import DeleteConfirmButton from './DeleteConfirmButton';
import profilePic from "../otherImages/profilePic.png";

const ClientDataTable = () => {
  const [filter, setFilter] = useState('monthly');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.clients);
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleEditClient = (rowData) => {
    navigate(`/edit-client/${rowData.id}`, { state: { client: rowData } });
  };
  const transformedClients = useMemo(() => {
    if (!clients) return [];
    return clients.map(client => ({
      ...client,
      date: client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A',
      packageNames: Array.isArray(client.packages) && client.packages.length > 0
        ? client.packages.map(pkg => pkg.name).join(', ')
        : 'None'
    }))
  }, [clients])

  const filteredData = useMemo(() => {
    if (filter === 'monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return transformedClients.filter(client => {
        const rowDate = new Date(client.created_at);
        return rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear;
      });
    }
    return transformedClients;
  }, [filter, transformedClients]);
  const columns = [
    {
      name: 'name',
      label: 'Client Name',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.name?.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-clientName val-${safeVal} d-flex align-items-center gap-8`}>
              <img
                style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                src={rowData.image_url ?? profilePic}
                alt="package"
              />
              {rowData.name}
            </div>
          );
        }
      }
    },
    {
      name: 'date',
      label: 'Date',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.date?.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-date val-${safeVal} text-gray-600`}>
              {rowData.date}
            </span>
          );
        }
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.email?.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-email val-${safeVal}`}>
              {rowData.email}
            </span>
          );
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.phone?.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-phone val-${safeVal} font-bold`}>
              {rowData.phone ?? 'N/A'}
            </span>
          );
        }
      }
    },
    {
      name: 'packageNames', // Changed from 'packages' to use our flattened field
      label: 'Assigned Packages',
      options: {
        searchable: true, // Enable searching
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const packagesArray = Array.isArray(rowData.packages) ? rowData.packages : [];
          const packageNames = packagesArray.map(pkg => pkg.name || 'Unnamed Package');
          const displayText = packageNames.length ? packageNames.join(', ') : 'None';
          const safeVal = displayText.toLowerCase().replace(/\s+/g, '-');

          return (
            <span className={`col-packages ${safeVal} px-2 py-1 rounded-full font-medium`}>
              {displayText}
            </span>
          );
        }
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <div>
              <Icon
                onClick={() => handleEditClient(rowData)}
                className="editBtn hover: cursor-pointer"
                icon="line-md:edit"
                width="24"
                height="24"
              />
              <DeleteConfirmButton
                item={{ id: rowData.id, name: rowData.name }}
                deleteAction={deleteClient}
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
    // searchOpen: true,
    customSearch: (searchQuery, currentRow) => {
      const searchValue = searchQuery.toLowerCase();
      return (
        currentRow.name?.toLowerCase().includes(searchValue) ||
        currentRow.email?.toLowerCase().includes(searchValue) ||
        currentRow.phone?.toLowerCase().includes(searchValue) ||
        currentRow.date?.toLowerCase().includes(searchValue) ||
        currentRow.packageNames?.toLowerCase().includes(searchValue) // Search in package names
      );
    }
  };

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div class="tableHeading">
          <h3 className='fs-3 fw-semibold'>
            {filter === "all"
              ? "All Client Overview"
              : "Monthly Client Overview"}
          </h3>
        </div>
        <div className="custom-toggle">
          <div className="toggle-container">
            <div
              className={`toggle-indicator ${filter === "all" ? "right" : "left"
                }`}
            />
            <div
              className={`toggle-option ${filter === "monthly" ? "active" : ""
                }`}
              onClick={() => setFilter("monthly")}
            >
              <Icon icon="mdi:account" width="22" />
              <span>This Month</span>
            </div>
            <div
              className={`toggle-option ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <Icon icon="mdi:account-group" width="25" />
              <span>All Time</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <MUIDataTable
          data={filteredData}
          columns={columns}
          options={options}
          className="overflow-hidden packageTable"
        />
      </div>
    </div>
  );
};

export default ClientDataTable;
