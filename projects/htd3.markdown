---
layout: htd3
---

# Visualisations with htd3.js

[htd3.js](https://github.com/BIMSBbioinfo/htd3) is a collection of
visualisations for genomic data built on top of the data visualisation
library [d3.js](http://d3js.org).


## Available visualisations

htd3.js currently offers the following visualisations: associations
graphs, sushi plots, exon-intron rendering, and region heatmaps.
Simple boxplots will also be made available soon.


## Composability

The visualisations offered by htd3.js are designed to be somewhat
composable.  To achieve this, htd3 splits input data into tracks and
binds graph data to separate layers within each track.  As a result,
data needed by the associations graph is contained in the
"associations" layer of any given track, whereas heatmap data is
confined to its own "heatmap" layer in each defined track.  This
allows a user of the library to quickly disassemble a composed graph
(for example to temporarily remove the heatmap component) without
affecting the rendering of any other piece of the visualisation.


## Preparing an HTML document for htd3.js

For embedding of visualisations inside an HTML document both the htd3
library as well as d3.js have to be included.  The following shows a
minimal HTML document where htd3 functions will be available:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="htd3.js" charset="utf-8"></script>
        <link href="htd3.css" media="all" rel="stylesheet" type="text/css">
      </head>
      <body>
        <!-- your content here -->
      </body>
    </html>

It is recommended to place htd3 code in a separate JavaScript file
that is loaded once the whole document has been rendered.
Alternatively, you can place your visualisation code inside a script
tag at the very bottom of the body tag.


## How to render data

Here is a simple invocation of the associations graph function used to
render colour-coded arcs between associated regions on tracks:

    htd3('associations', '#example1')
      .load('example.bed');

This will select the tag with id "example1" in your HTML document as
the target for an associations graph, load and process the data file
"example.bed" and render an associations graph.  The contents of
the "example1" DOM node will be overwritten with the SVG graph.

htd3 can load data from files containing tab-separated fields when a
file name is passed to the `load` function, or it can process
structured data if a JSON object is passed.  (Note that browsers
prohibit loading files from remote locations unless cross-origin
requests are explicitly permitted.)  A file to be loaded must contain
records with tab-separated fields; every record is to placed on its
own line.  The order of fields is not important; it is inferred from
the order of column headers in the first row of the file.  The row
names cannot be customised.  Different visualisations require
different columns to be present.

Here is another example of an associations graph, but this time JSON
data is passed to the load function directly:

    var testData = [{ chr: 'chr3',
                      start: 10,
                      end:   20,
                      targetChr: 'chr3',
                      targetStart: 60,
                      targetEnd: 62,
                      score: 3,
                    },
                    { chr: 'chr5',
                      start: 70,
                      end:   100,
                      targetChr: 'chr5',
                      targetStart: 57,
                      targetEnd: 59,
                      score: 7,
                    },
                   ];

    htd3('associations', '#example2').load(testData);

`testData` is a JSON array containing two elements.  Each element is a
JSON object with various required keys.

The above data structure would be rendered thus:

<div id="example2"></div>
<script type="text/javascript">
var testData = [{ chr: 'chr3',
                  start: 10,
                  end:   20,
                  targetChr: 'chr3',
                  targetStart: 60,
                  targetEnd: 62,
                  score: 3,
                },
                { chr: 'chr5',
                  start: 70,
                  end:   100,
                  targetChr: 'chr5',
                  targetStart: 57,
                  targetEnd: 59,
                  score: 7,
                },
               ];

htd3('associations', '#example2').load(testData);
</script>
