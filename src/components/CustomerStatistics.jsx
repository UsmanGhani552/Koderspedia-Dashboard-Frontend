import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

const CustomerStatistics = ({ filter, selectedYear }) => {
  const { clients } = useSelector((state) => state.clients);

  // Filter clients based on year or all time
  const getFilteredClients = () => {
    if (filter === 'all') {
      return clients; // Return all clients
    } else {
      // Filter by selected year
      return clients.filter(client => {
        if (!client?.created_at) return false;
        const clientDate = new Date(client.created_at);
        return clientDate.getFullYear() === selectedYear;
      });
    }
  };

  // Get monthly customer counts
  const getMonthlyData = () => {
    const filteredClients = getFilteredClients();
    const monthArray = Array(12).fill(0);
    
    filteredClients.forEach(client => {
      if (client?.created_at) {
        const clientDate = new Date(client.created_at);
        const month = clientDate.getMonth();
        monthArray[month]++;
      }
    });
    
    return monthArray;
  };

  const monthArray = getMonthlyData();
  
  let chartSeries = [
    {
      name: filter === 'all' ? "All Time" : selectedYear.toString(),
      data: monthArray,
    },
  ];

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
        formatter: function(val, { series, seriesIndex, dataPointIndex, w }) {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const year = filter === 'all' ? 'All Years' : selectedYear;
          return `${monthNames[dataPointIndex]} ${year}`;
        }
      },
      y: {
        formatter: function(value) {
          return `${value} customers`;
        },
        title: {
          formatter: function() {
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
      title: {
        text: 'Number of Customers',
        style: {
          fontSize: '14px',
        }
      },
      labels: {
        formatter: function (value) {
          return Math.round(value);
        },
        style: {
          fontSize: "14px",
        },
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
    <div className="col-xxl-12 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-start mb-3 mt-20">
            <h6 className="text-lg mb-0 mt-0">
              Customers Growth {filter === 'all' ? '(All Time)' : `(${selectedYear})`}
            </h6>
            <ul className='salesList'>
              <li className="text-sm fw-semibold">X-axis: Months</li>
              <li className="text-sm fw-semibold">Y-axis: Number of Customers</li>
            </ul>
          </div>
          <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={264} />
        </div>
      </div>
    </div>
  );
};

export default CustomerStatistics;