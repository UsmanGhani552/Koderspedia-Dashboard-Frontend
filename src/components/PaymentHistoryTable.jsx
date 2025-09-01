import MUIDataTable from 'mui-datatables';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPaymentHistory } from '../store/slices/paymentHistorySlice';

const PaymentHistoryTable = () => {
  const dispatch = useDispatch();
  const { paymentHistory} = useSelector((state) => state.paymentHistory);
  useEffect(() => {
    dispatch(fetchPaymentHistory()); // Now properly calling the function
  }, [dispatch]);
  console.log(paymentHistory);

  const transformedData = useMemo(() => {
    return paymentHistory.map(history => ({
      ...history,
      date: history.created_at ? new Date(history.created_at).toLocaleDateString() : 'N/A',
      status: getStatusText(history.status)
    }));
  });

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
    'In Progress': 'bg-info',
    'Completed': 'bg-success',
    'Unknown': 'bg-secondary'
  };
  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        customBodyRender: (value, tableMeta) => {
          console.log(value);
          const safeVal = value.toLowerCase().replace(/\s+/g, '_');
          return (
            <div className={`col-title val-${safeVal} d-flex align-items-center gap-8`}>
              {value}
            </div>
          );
        }
      }
    },

    // {
    //   name: 'description',
    //   label: 'Description',
    //   options: {
    //     customBodyRender: (value) => {
    //       const safeVal = value.toLowerCase().replace(/\s+/g, '-');
    //       return (
    //         <span className={`col-description val-${safeVal}`}>
    //           {value}
    //         </span>
    //       );
    //     }
    //   }
    // },

    {
      name: 'price',
      label: 'Price',
      options: {
        customBodyRender: (value) => {
          const safeVal = value;
          return (
            <span className={`col-price packagePrice val-${safeVal} font-bold fs-6`}>
              ${value}
            </span>
          );
        }
      }
    },

    {
      name: 'date',
      label: 'Created At',
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
      name: 'status',
      label: 'Payment Status',
      options: {
        customBodyRender: (value) => {
          const safeVal = value.toLowerCase().replace(/\s+/g, '-');
          const colorClass = statusColorMap[value];
          return (
            <span className={`col-price val-${safeVal} ${colorClass} text-light-600`}>
              {value}
            </span>
          );
        }
      }
    }
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
  };

  return (
    <div className="card basic-data-table">
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

export default PaymentHistoryTable;