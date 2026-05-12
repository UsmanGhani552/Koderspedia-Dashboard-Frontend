import React, { useMemo, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClient, fetchClients } from '../store/slices/clientSlice';
import DeleteConfirmButton from './DeleteConfirmButton';
import profilePic from '../otherImages/profilePic.png';

const CustomersList = ({ filter, selectedYear }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleEditClient = (rowData) => {
    navigate(`/edit-client/${rowData.id}`, { state: { client: rowData } });
  };

  // Normalize shape for table
  const transformedClients = useMemo(() => {
    if (!Array.isArray(clients)) return [];
    return clients.map((client) => {
      const createdAt = client?.created_at ? new Date(client.created_at) : null;
      const dateStr = createdAt && !isNaN(createdAt) ? createdAt.toLocaleDateString() : 'N/A';

      const packagesArray = Array.isArray(client?.packages) ? client.packages : [];
      const packageNames = packagesArray.length
        ? packagesArray.map((p) => p?.name || 'Unnamed Package').join(', ')
        : 'None';

      return {
        ...client,
        date: dateStr,
        packageNames,
        image_url: client?.image_url || profilePic,
      };
    });
  }, [clients]);

  // Filter clients based on filter and selectedYear
  const filteredClients = useMemo(() => {
    if (filter === 'all') {
      return transformedClients; // Show all clients
    } else {
      // Filter by selected year
      return transformedClients.filter((client) => {
        if (!client.created_at) return false;
        const clientDate = new Date(client.created_at);
        return clientDate.getFullYear() === selectedYear;
      });
    }
  }, [transformedClients, filter, selectedYear]);

  const getTableTitle = () => {
    if (filter === 'all') {
      return "All Time Client Overview";
    } else {
      return `${selectedYear} Client Overview`;
    }
  };

  const columns = [
    {
      name: 'name',
      label: 'Client Name',
      options: {
        sort: true,
        filter: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          const safeVal = rowData.name?.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-clientName val-${safeVal} d-flex align-items-center gap-8`}>
              <img
                style={{ height: '35px', width: '35px', borderRadius: '50%' }}
                src={rowData.image_url}
                alt="client"
              />
              {rowData.name}
            </div>
          );
        },
      },
    },
    {
      name: 'date',
      label: 'Date',
      options: {
        sort: true,
        filter: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          const safeVal = rowData.date?.toLowerCase().replace(/\s+/g, '-');
          return <span className={`col-date val-${safeVal} text-gray-600`}>{rowData.date}</span>;
        },
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      options: {
        sort: true,
        filter: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          const safeVal = rowData.email?.toLowerCase().replace(/\s+/g, '-');
          return <span className={`col-email val-${safeVal}`}>{rowData.email}</span>;
        },
      },
    },
    {
      name: 'phone',
      label: 'Phone',
      options: {
        sort: true,
        filter: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          const safeVal = String(rowData.phone || 'N/A')?.toLowerCase().replace(/\s+/g, '-');
          return <span className={`col-phone val-${safeVal} font-bold`}>{rowData.phone ?? 'N/A'}</span>;
        },
      },
    },
    {
      name: 'packageNames',
      label: 'Assigned Packages',
      options: {
        sort: true,
        filter: true,
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          const displayText = rowData.packageNames || 'None';
          const safeVal = displayText.toLowerCase().replace(/\s+/g, '-');
          return (
            <span className={`col-packages ${safeVal} px-2 py-1 rounded-full font-medium`}>
              {displayText}
            </span>
          );
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredClients[dataIndex];
          return (
            <div className="d-flex gap-2">
              <Icon
                onClick={() => handleEditClient(rowData)}
                className="editBtn hover: cursor-pointer text-primary"
                icon="line-md:edit"
                width="24"
                height="24"
              />
              <DeleteConfirmButton
                item={{ id: rowData.id, name: rowData.name }}
                deleteAction={deleteClient}
                className="deleteBtn hover:cursor-pointer text-danger"
                title="Delete Client"
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
    searchPlaceholder: 'Search clients…',
    customSearch: (searchQuery, currentRow) => {
      const q = (searchQuery || '').toLowerCase();
      return (
        String(currentRow[0] || '').toLowerCase().includes(q) || // name
        String(currentRow[1] || '').toLowerCase().includes(q) || // date
        String(currentRow[2] || '').toLowerCase().includes(q) || // email
        String(currentRow[3] || '').toLowerCase().includes(q) || // phone
        String(currentRow[4] || '').toLowerCase().includes(q)    // packageNames
      );
    },
    textLabels: {
      body: {
        noMatch: loading ? 'Loading…' : error ? 'Failed to load data' : 'No records found',
      },
    },
  };

  return (
    <>
      <h2 className="fs-2 mt-40 mb-0">{getTableTitle()}</h2>
      <div className="mt-2 mb-3 text-muted">
        {filter === 'all' 
          ? 'Showing all clients from all years' 
          : `Showing clients from ${selectedYear}`}
      </div>
      
      <div className="card-body">
        <MUIDataTable
          data={filteredClients}
          columns={columns}
          options={options}
          className="overflow-hidden packageTable"
        />
      </div>
    </>
  );
};

export default CustomersList;