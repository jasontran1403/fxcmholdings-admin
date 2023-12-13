import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";



var dataItem = [];
const LineColumnArea = () => {
  const [dataHistory, setData] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiQURNSU5fTE9HSU4iLCJleHAiOjE3MDI2Njg3ODJ9.2uQJhG5z3Geh_ixW2h3vxdVEfWXU3P2yfODGOTX-Ju0");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/api/admin/fillChart", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // Mảng cố định của tháng để xác định thứ tự
        const monthsOrder = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

        // Chuyển đổi đối tượng sang mảng giá trị theo thứ tự
        const dataArray = monthsOrder.map(month => result[month] || 0);
        setData(dataArray);
      })
      .catch(error => console.log('error', error));
  }, []);

  const LineColumnAreaData = {
    series: [
      {
        name: "Investment History",
        type: "column",
        data: Object.values(dataHistory),
      }
    ],
    options: {
      chart: {
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [0, 0.5, 1],
        curve: "smooth",
        dashArray: [0, 8, 5]
      },
      plotOptions: {
        bar: {
          columnWidth: "18%",
        },
      },
      colors: ["#0ab39c", "rgba(212, 218, 221, 0.18)", "rgb(251, 77, 83)"],

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      markers: {
        size: 0,
      },
      legend: {
        offsetY: 11,
      },
      xaxis: {
        type: "month",
      },
      yaxis: {
        title: {
          text: "$",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + "$"
            }
            return y
          },
        },
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    },
  }


  return (
    <React.Fragment>
      <ReactApexChart
        options={LineColumnAreaData.options}
        series={LineColumnAreaData.series}
        type="line"
        height="350"
        stacked="false"
        className="apex-charts"
      />
    </React.Fragment>
  )
}

export default LineColumnArea;