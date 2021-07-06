// Mapping through data array in data.js file to set sales string to number
// This is done to ensure charts are being displayed correctly
const mappedData = dataArr.map((data) => {
  const sales = parseInt(data.sales);
  return { ...data, sales };
});

// Object variable to store all selectors for html elements
// This is done to avoid repetition and to ensure we are following DRY principles
const HTML_Element = {
  DISPLAY_CHARTS_BUTTON: ".display-charts-btn",
  BARCHART_DROPDOWN_GROUP: ".barchart-dropdown-group",
  BARCHART_DROPDOWN_IFAS: "#barchart-ifas",
  BARCHART_DROPDOWN_FUNDS: "#barchart-funds",
  PIECHART_DROPDOWN_GROUP: ".piechart-dropdown-group",
  PIECHART_DROPDOWN_YEARS: "#piechart-years",
  PIECHART_DROPDOWN_FUNDS: "#piechart-funds"
};

// Variables created to store a record of the different keys in the data
// example: Data_Set.IFAS  will return an array of ifa mentioned in the data
const IFASData = [...new Set(mappedData.map((data) => data.ifa))]
const FUNDSData = [...new Set(mappedData.map((data) => data.fund))]
const YEARSData = [...new Set(mappedData.map((data) => data.year))]

// Function to hide chart containers
const clearPage = () =>
  document
    .querySelectorAll(".chart-container")
    .forEach((container) => (container.style.visibility = "hidden"));

// Function to set all event listeners on html elements
const setEventListeners = () => {
  // set changle event on dropdowns
  document
    .querySelectorAll(`${HTML_Element.BARCHART_DROPDOWN_GROUP}`)
    .forEach((dropdown) =>
      dropdown.addEventListener("change", (event) =>
        filterBarChartData(event.target)
      )
    );
  document
    .querySelectorAll(`${HTML_Element.PIECHART_DROPDOWN_GROUP}`)
    .forEach((dropdown) =>
      dropdown.addEventListener("change", (event) =>
        filterPieChartData(event.target)
      )
    );

  // set click event on display buttons
  document
    .querySelectorAll(`${HTML_Element.DISPLAY_CHARTS_BUTTON}`)
    .forEach((btn) =>
      btn.addEventListener("click", (event) => {
        clearPage();
        const chartToDisplay = event.target.getAttribute("data-target");
        // if display pie chart button is clicked show pie chart
        if (chartToDisplay === "pie-chart") {
          showPieChart(mappedData);
          document.querySelector(`#${chartToDisplay}`).style.visibility =
            "visible";
        }

        // else show bar chart
        showBarChart(mappedData);
        document.querySelector(`#${chartToDisplay}`).style.visibility =
          "visible";
      })
    );
};

// Function to dynamically load dropdown options for barcharts
const buildBarChartDropdownHtml = () => {
  // loop through ifas data set and create a html option element for each value
  // then add to BARCHART_DROPDOWN_IFAS inner html to display list of ifas
  const ifasHtml = IFASData.map(
    (ifa) => `<option value="${ifa}">${ifa}</option>`
  );
  const ifasDropdown = document.querySelector(
    `${HTML_Element.BARCHART_DROPDOWN_IFAS}`
  )
  ifasDropdown.innerHTML += ifasHtml;

  // loop through funds data set and create a html option element for each value
  // then add to BARCHART_DROPDOWN_FUNDS inner html to display list of ifas
  const fundsHtml = FUNDSData.map(
    (fund) => `<option value="${fund}">${fund}</option>`
  );
  const fundsDropdown = document.querySelector(
    `${HTML_Element.BARCHART_DROPDOWN_FUNDS}`
  )
  fundsDropdown.innerHTML += fundsHtml;
};

// Function to dynamically load dropdown options for piecharts
const buildPieChartDropdownHtml = () => {
  // loop through years data set and create a html option element for each value
  // then add to PIECHART_DROPDOWN_YEARS inner html to display list of years
  const ifasHtml = YEARSData.map(
    (ifa) => `<option value="${ifa}">${ifa}</option>`
  );
  document.querySelector(
    `${HTML_Element.PIECHART_DROPDOWN_YEARS}`
  ).innerHTML += ifasHtml;

  // loop through funds data set and create a html option element for each value
  // then add to PIECHART_DROPDOWN_FUNDS inner html to display list of ifas
  const fundsHtml = FUNDSData.map(
    (fund) => `<option value="${fund}">${fund}</option>`
  );
  document.querySelector(
    `${HTML_Element.PIECHART_DROPDOWN_FUNDS}`
  ).innerHTML += fundsHtml;
};

// check which value to filter array by for bar chart
const filterBarChartData = (selected) => {
  if (`#${selected.id}` === HTML_Element.BARCHART_DROPDOWN_IFAS) {
    const data = mappedData.filter((data) => data.ifa === selected.value);
    return showBarChart(data);
  }
  const data = mappedData.filter((data) => data.fund === selected.value);
  return showBarChart(data);
};

// check which value to filter array by for bar chart
const filterPieChartData = (selected) => {
  if (`#${selected.id}` === HTML_Element.PIECHART_DROPDOWN_YEARS) {
    const data = mappedData.filter((data) => data.year === selected.value);
    return showPieChart(data);
  }
  const data = mappedData.filter((data) => data.fund === selected.value);
  return showPieChart(data);
};

const showPieChart = (data) => {
  picasso.chart({
    element: document.querySelector("#pie-chart"),
    data: [
      {
        type: "matrix",
        data: data
      }
    ],
    settings: {
      scales: {
        c: {
          data: { extract: { field: "ifa" } },
          type: "color"
        }
      },
      components: [
        {
          type: "legend-cat",
          scale: "c"
        },
        {
          key: "p",
          type: "pie",
          data: {
            extract: {
              field: "ifa",
              props: {
                num: { field: "sales" }
              }
            }
          },
          settings: {
            slice: {
              arc: { ref: "num" },
              fill: { scale: "c" },
              outerRadius: () => 0.9,
              strokeWidth: 1,
              stroke: "rgba(255, 255, 255, 0.5)"
            }
          }
        }
      ]
    }
  });
};

const showBarChart = (data) => {
  picasso.chart({
    element: document.querySelector("#bar-chart"),
    data: [
      {
        type: "matrix",
        data: data
      }
    ],
    settings: {
      scales: {
        y: {
          data: { field: "sales" },
          invert: true,
          include: [0]
        },
        c: {
          data: { field: "sales" },
          type: "color"
        },
        t: { data: { extract: { field: "year" } }, padding: 0.3 }
      },
      components: [
        {
          type: "axis",
          dock: "left",
          scale: "y"
        },
        {
          type: "axis",
          dock: "bottom",
          scale: "t"
        },
        {
          key: "bars",
          type: "box",
          data: {
            extract: {
              field: "year",
              props: {
                start: 0,
                end: { field: "sales" }
              }
            }
          },
          settings: {
            major: { scale: "t" },
            minor: { scale: "y" },
            box: {
              fill: { scale: "c", ref: "end" }
            }
          }
        }
      ]
    }
  });
};

const init = () => {
  console.log("running app.js");
  setEventListeners();
  buildBarChartDropdownHtml();
  buildPieChartDropdownHtml();
};

// calling init function to initialise functionality
init();
