function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("./static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("./static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSampleArray = samples.filter(
      (sampleObject) => sampleObject.id == sample
    );

    let metadata = data.metadata;

    let metadataResultArray = metadata.filter(
      (sampleObj) => sampleObj.id == sample
    );
    //  5. Create a variable that holds the first sample in the array.
    var filteredSample = filteredSampleArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    let metadataResult = metadataResultArray[0];

    var otuIds = filteredSample.otu_ids;

    var otuLabels = filteredSample.otu_labels;

    var sampleValues = filteredSample.sample_values;

    var washFreq = metadataResult.wfreq;

    var washFreqFloat = parseFloat(washFreq);

    // 7. Create the yticks for the bar chart.

    var yticks = otuIds
      .slice(0, 10)
      .map((otuId) => `OTU ${otuId}`)
      .reverse();

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        type: "bar",
        orientation: "h",
        text: otuLabels.slice(0, 10).reverse(),
      },
    ];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: `Top 10 Bacteria Cultures Found in ${sample}`,
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        mode: "markers",
        marker: {
          color: otuIds,
          size: sampleValues,
          colorscale: "jet",
        },
        text: otuLabels,
        opacity: 0.9,
      },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `Bacteria Cultures Per Sample ${sample}`,
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreqFloat,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "darkslategrey" },
          steps: [
            { range: [0, 2], color: "turquoise" },
            { range: [2, 4], color: "lightseagreen" },
            { range: [4, 6], color: "darkturqouise" },
            { range: [6, 8], color: "cadetblue" },
            { range: [8, 10], color: "paleturquoise" },
          ],
        },
      },
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

buildCharts();
