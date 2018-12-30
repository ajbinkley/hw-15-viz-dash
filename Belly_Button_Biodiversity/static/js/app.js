function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sampleData) => {

    var metaData = d3.select('#sample-metadata')
      .html('');

    // console.log(sampleData);

    Object.entries(sampleData).forEach(([key, value]) => {
      // console.log(`${key} ${value}`);
      metaData.append('p')
        .text(`${key} ${value}`)
    });

  });
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then((sampleChart) => {
    console.log(sampleChart);

    var trace1 = {
      x: sampleChart.otu_ids,
      y: sampleChart.sample_values,
      text: sampleChart.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleChart.sample_values,
        color: sampleChart.otu_ids
      }
    };
    
    var data = [trace1];
    
    Plotly.newPlot('bubble', data);

    // @TODO: Build a Pie Chart
    
    // sort all arrays in object to fit the order of the top 10 sample_values
    // otherwise, sorting just one array throws the id and label order off
    // because it doesn't sort them. function is needed

    var sampleIds = sampleChart.otu_ids;
    var sampleLabels = sampleChart.otu_labels;
    var sampleValues = sampleChart.sample_values;

    var list = [];
    for (var j = 0; j < sampleIds.length; j++) {
      list.push({'id':sampleIds[j],
                'label':sampleLabels[j],
                'value':sampleValues[j]
    });

    list.sort(function(a,b) {
      return ((a.value > b.value) ? -1 : ((a.value == b.value) ? 0 : 1));
    });

    for (var k = 0; k < list.length; k++) {
      sampleIds[k] = list[k].id;
      sampleLabels[k] = list[k].label;
      sampleValues[k] = list[k].value;
      }
    };


    // assign top 10 values from each sorted array to vars
    var topTenValues = sampleValues.slice(0,10);
    var topTenIds = sampleIds.slice(0,10);
    var topTenLabels = sampleLabels.slice(0,10);

    // create pie chart
    var pieData = [{
      values: topTenValues,
      labels: topTenIds,
      textinfo: 'percent',
      type: 'pie'
    }];

    var trace = pieData[0];

    trace.text = topTenLabels.map(function(v) {
      return v;
    })

    trace.hoverinfo = 'text';
    
    Plotly.newPlot('pie', pieData);

  })

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
