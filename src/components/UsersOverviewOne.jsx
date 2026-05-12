import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const UsersOverviewOne = ({ filter, selectedYear }) => {
  const { invoices } = useSelector((state) => state.invoices);
  // Filter invoices based on filter and selectedYear
  // const getFilteredInvoices = () => {
  //   if (filter === 'all') {
  //     return invoices; // Return all invoices
  //   } else if (filter === 'monthly') {
  //     // Filter by selected year
  //     return invoices.filter(invoice => {
  //       if (!invoice?.created_at) return false;
  //       const invoiceDate = new Date(invoice.created_at);
  //       return invoiceDate.getMonth() === new Date().getMonth() && invoiceDate.getFullYear() === selectedYear;
  //     });
  //   } else {
  //     // Filter by selected year
  //     return invoices.filter(invoice => {
  //       if (!invoice?.created_at) return false;
  //       const invoiceDate = new Date(invoice.created_at);
  //       return invoiceDate.getFullYear() === selectedYear;
  //     });
  //   }
  // };

  const getFilteredInvoices = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    switch (filter) {
      case 'all':
        return invoices;
      case 'yearly':
        return invoices.filter(invoice => {
          if (!invoice?.created_at) return false;
          const invoiceDate = new Date(invoice.created_at);
          return invoiceDate.getFullYear() === selectedYear;
        });
      case 'monthly':
        return invoices.filter(invoice => {
          if (!invoice?.created_at) return false;
          const invoiceDate = new Date(invoice.created_at);
          return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
        });

      default:
        return invoices;
    }
  }

  const filteredInvoices = getFilteredInvoices();
  console.log(filteredInvoices);
  // Count sale types
  const freshSale = filteredInvoices.filter(invoice => invoice.sale_type === 'fresh sale').length;
  const upsell = filteredInvoices.filter(invoice => invoice.sale_type === 'upsell').length;
  const recurring = filteredInvoices.filter(invoice => invoice.sale_type === 'recurring').length;
  console.log(freshSale)
  let donutChartSeries = [freshSale, upsell, recurring];
  let total = donutChartSeries.reduce((acc, val) => acc + val, 0);

  let donutChartOptions = {
    colors: ["#707070", "#164AFF", "#92BFFF"],
    labels: ["Front sell", "Upsell", "Recurring"],
    legend: {
      show: false,
    },
    chart: {
      type: "donut",
      height: 270,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex }) {
          const percent = (value / total) * 100;
          return `${value} (${percent.toFixed(1)}%)`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const getCardTitle = () => {
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    switch (filter) {
      case 'all':
        return "Sales (All Time)"

      case 'yearly':
        return `Sales (${selectedYear})`

      case 'monthly':
        return `Sales (${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()})`
    }
  };

  return (
    <div className="col-xxl-3 col-xl-6">
      <div className="card h-100 radius-8 border-0 overflow-hidden">
        <div className="card-body p-24">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-40 fw-bold text-lg">{getCardTitle()}</h6>
            {/* <div className="text-xs text-muted">
              Total: {total} invoices
            </div> */}
          </div>

          <div className="d-flex justify-content-center">
            <ReactApexChart
              options={donutChartOptions}
              series={donutChartSeries}
              type="donut"
              height={150}
              width={150}
            />
          </div>

          <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
            {donutChartSeries.map((value, index) => {
              const label = donutChartOptions.labels[index];
              const color = donutChartOptions.colors[index];
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

              return (
                <li key={index} className="d-flex align-items-center gap-2 w-100">
                  <span
                    className="w-12-px h-12-px radius-6"
                    style={{ backgroundColor: color }}
                  />
                  <div className='d-flex justify-content-between w-100'>
                    <div className="text-secondary-light text-sm fw-normal">
                      {label}:{" "}
                      <span className="fw-semibold">{value}</span>
                    </div>
                    <div className="text-primary-light text-sm fw-normal">
                      {percent}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsersOverviewOne;