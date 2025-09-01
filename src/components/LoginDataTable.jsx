import React, { useState, useMemo, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { fetchloginActivity } from "../store/slices/loginActivitySlice";
import { useDispatch } from "react-redux";

const LoginDataTable = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-12-10"));
  const [filter] = useState("");
  const { loginActivity } = useSelector((state) => state.loginActivity);

  useEffect(() => {
    dispatch(fetchloginActivity());
  }, [dispatch]);

  const CustomInput = ({ value, onClick }) => (
    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={onClick}>
      <Icon icon="uil:calender" width="18" />
      <span>{value}</span>
    </button>
  );

  // Transform data to include flattened fields for searching
  const transformedData = useMemo(() => {
    return loginActivity.map(item => ({
      ...item,
      userName: item.user?.name || '',
      statusText: item.status == 1 ? 'Success' : 'Failed',
      // Add localized time string
      localTime: new Date(item.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      // Keep original time for filtering/class names
      originalTime: item.time
    }));
  }, [loginActivity]);

  const filteredData = useMemo(() => {
    return transformedData.filter((pkg) => {
      const rowDate = new Date(pkg.date);
      const isInDateRange =
        rowDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        rowDate <= new Date(endDate.setHours(23, 59, 59, 999));
      const isInTypeFilter = !filter || pkg.clientsName === filter;
      return isInDateRange && isInTypeFilter;
    });
  }, [startDate, endDate, filter, transformedData]);

  const columns = [
    {
      name: "userName", // Use flattened field
      label: "Name",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <span className={`col-client-name val-${rowData.userName.toLowerCase().replace(/\s+/g, "-")}`}>
              {rowData.userName}
            </span>
          );
        }
      }
    },
    {
      name: "time",
      label: "Time",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <span className={`col-time val-${rowData.time.replace(/:/g, "-")}`}>
              {rowData.localTime}
            </span>
          );
        }
      }
    },
    {
      name: "ip_address",
      label: "External IP",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <span className={`col-external-ip val-${rowData.ip_address.replace(/\./g, "-")}`}>
              {rowData.ip_address}
            </span>
          );
        }
      }
    },
    {
      name: "type",
      label: "Type",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const colorClass = rowData.type === "login"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
          return (
            <span className={`col-type px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {rowData.type}
            </span>
          );
        }
      }
    },
    {
      name: "date",
      label: "Date",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          return (
            <span className={`col-date val-${rowData.date.toLowerCase().replace(/\s+/g, "-")}`}>
              {rowData.date}
            </span>
          );
        }
      }
    },
    {
      name: "statusText", // Use flattened field
      label: "Success",
      options: {
        searchable: true,
        customBodyRenderLite: (dataIndex) => {
          const rowData = filteredData[dataIndex];
          const statusClass = rowData.status == 1 ? "text-success" : "text-danger";
          return (
            <span className={`col-success ${statusClass}`}>
              {rowData.statusText}
            </span>
          );
        }
      }
    },
  ];

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    responsive: "standard",
    elevation: 0,
    print: false,
    download: false,
    viewColumns: false,
    filter: false,
    search: true,
    searchPlaceholder: "Search by any field...",
    onSearchChange: (searchText) => {
      console.log("Searching for:", searchText);
    }
  };

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="tableHeading">
          <h3 className="fs-3 fw-semibold">
            {filter === "all clients" ? "All Invoices" : "Security and Confidentiality Report"}
          </h3>
        </div>
        <div className="filterWrapper">
          <div className="d-flex align-items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<CustomInput />}
              dateFormat="dd MMM yyyy"
            />
            <span>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<CustomInput />}
              dateFormat="dd MMM yyyy"
            />
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

export default LoginDataTable;