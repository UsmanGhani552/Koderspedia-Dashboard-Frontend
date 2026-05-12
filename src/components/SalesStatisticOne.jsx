import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const SalesStatisticOne = ({ filter, selectedYear: propSelectedYear }) => {
  const { invoices } = useSelector((state) => state.invoices);
  const [localSelectedYear, setLocalSelectedYear] = useState(propSelectedYear);
  const [availableYears, setAvailableYears] = useState([]);

  // Get unique years from invoices
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const years = [...new Set(invoices.map(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate.getFullYear();
      }))].sort((a, b) => b - a);

      setAvailableYears(years);
    }
  }, [invoices]);

  // Filter invoices by month and year
  const monthlyInvoice = (month, year) => {
    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate.getMonth() === month && invoiceDate.getFullYear() === year;
    });
  };

  // For "all time" - show aggregated data across all years
  const getAllTimeMonthlyData = () => {
    const monthCounts = Array(12).fill(0);

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.created_at);
      const month = invoiceDate.getMonth();
      monthCounts[month]++;
    });

    return monthCounts;
  };

  // For yearly view - show data for selected year
  const getYearlyMonthlyData = (year) => {
    const monthData = [];
    for (let i = 0; i < 12; i++) {
      monthData.push(monthlyInvoice(i, year).length);
    }
    return monthData;
  };

  // For monthly view - show data for current month
  const getCurrentMonthData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Create array with 12 zeros, set only current month
    const monthData = Array(12).fill(0);
    const currentMonthInvoices = monthlyInvoice(currentMonth, currentYear);
    monthData[currentMonth] = currentMonthInvoices.length;

    return monthData;
  };

  // Get data based on filter
  const getChartData = () => {
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (filter === 'all') {
      return {
        series: [{
          name: "All Time Total",
          data: getAllTimeMonthlyData(),
        }],
        title: "Invoices Growth (All Time)"
      };
    } else if (filter === 'yearly') {
      return {
        series: [{
          name: `${localSelectedYear}`, // Changed from selectedYear to localSelectedYear
          data: getYearlyMonthlyData(localSelectedYear), // Changed here
        }],
        title: `Invoices Growth (${localSelectedYear})` // Changed here
      };
    } else { // monthly
      const currentMonthName = monthNames[currentDate.getMonth()];
      return {
        series: [{
          name: `${currentMonthName} ${currentDate.getFullYear()}`,
          data: getCurrentMonthData(),
        }],
        title: `Invoices Growth (${currentMonthName} ${currentDate.getFullYear()})`
      };
    }
  };

  const chartData = getChartData();

  let chartOptions = {
    chart: {
      height: 264,
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      dropShadow: {
        enabled: false,
        top: 6,
        left: 0,
        blur: 4,
        color: "#000",
        opacity: 0.1,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      colors: ["#bbb"],
      width: 3,
    },
    markers: {
      size: 0,
      strokeWidth: 3,
      hover: {
        size: 8,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          if (filter === 'all') {
            return `${monthNames[dataPointIndex]} (All Years)`;
          } else if (filter === 'yearly') {
            return `${monthNames[dataPointIndex]} ${localSelectedYear}`;
          } else { // monthly
            const currentDate = new Date();
            return `${monthNames[dataPointIndex]} ${currentDate.getFullYear()}`;
          }
        }
      },
      y: {
        formatter: function (value) {
          return `${value} invoice${value !== 1 ? 's' : ''}`;
        },
        title: {
          formatter: function () {
            return 'Count: ';
          }
        }
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
      borderColor: "#D1D5DB",
      strokeDashArray: 3,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return Math.round(value);
        },
        style: {
          fontSize: "14px",
        },
      },
      title: {
        text: 'Number of Invoices',
        style: {
          fontSize: '14px',
        }
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      tooltip: {
        enabled: false,
      },
      labels: {
        formatter: function (value) {
          return value;
        },
        style: {
          fontSize: "14px",
        },
      },
      axisBorder: {
        show: false,
      },
      crosshairs: {
        show: true,
        width: 20,
        stroke: {
          width: 0,
        },
        fill: {
          type: "solid",
          color: "#487FFF40",
        },
      },
    },
  };

  return (
    <div className="col-xxl-6 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 mt-20">
            <div>
              <h6 className="text-lg mb-0 mt-0">{chartData.title}</h6>
            </div>

            {/* Year selector for yearly view */}
            {filter === 'yearly' && availableYears.length > 0 && (
              <div className="year-selector">
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={localSelectedYear}
                  onChange={(e) => setLocalSelectedYear(parseInt(e.target.value))}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}

            <ul className='salesList'>
              <li className="text-sm fw-semibold">X-axis: Months</li>
              <li className="text-sm fw-semibold">Y-axis: Number of Invoices</li>
            </ul>
          </div>

          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="area"
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesStatisticOne;