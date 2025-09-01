import React, { useState, useMemo, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import DeleteConfirmButton from './DeleteConfirmButton';
import { deleteBrand, fetchBrands } from '../store/slices/brandSlice';

const BrandDataTable = () => {
  const [filter ] = useState('monthly');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands);
  console.log("Brands:", brands);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEditBrand = (rowData) => {
    navigate(`/edit-brand/${rowData.id}`, { state: { brand: rowData } });
  };
  const transformedBrands = useMemo(() => {
    console.log("Brands Data:", brands);
    if (!brands) return [];
    return brands.map(brand => ({
      ...brand,
      date: brand.created_at ? new Date(brand.created_at).toLocaleDateString() : 'N/A',
      packageNames: Array.isArray(brand.packages) && brand.packages.length > 0
        ? brand.packages.map(pkg => pkg.name).join(', ')
        : 'None'
    }))
  }, [brands]);
  const filteredData = transformedBrands;

  const columns = [
    {
      name: 'name',
      label: 'Brand Name',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.name?.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-clientName val-${safeVal} d-flex align-items-center gap-8`}>
              <img
                style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                src={rowData.logo_mini_url}
                alt="package"
              />
              {rowData.name}
            </div>
          );
        }
      }
    },
    {
      name: 'logo',
      label: 'Logo',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const safeVal = rowData.name?.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-clientName val-${safeVal} d-flex align-items-center gap-8`}>
              <img
                style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                src={rowData.logo_url}
                alt="package"
              />
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
    // {
    //   name: 'address',
    //   label: 'Address',
    //   options: {
    //     customBodyRenderLite: (dataIndex) => {
    //       const rowData = filteredData[dataIndex];
    //       const safeVal = rowData.address?.toLowerCase().replace(/\s+/g, '-');
    //       return (
    //         <span className={`col-address val-${safeVal} font-bold`}>
    //           {rowData.address ?? 'N/A'}
    //         </span>
    //       );
    //     }
    //   }
    // },
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
                onClick={() => handleEditBrand(rowData)}
                className="editBtn hover: cursor-pointer"
                icon="line-md:edit"
                width="24"
                height="24"
              />
              <DeleteConfirmButton
                item={{ id: rowData.id, name: rowData.name }}
                deleteAction={deleteBrand}
                className="deleteBtn hover:cursor-pointer"
                title="Delete Brand"
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

export default BrandDataTable;
