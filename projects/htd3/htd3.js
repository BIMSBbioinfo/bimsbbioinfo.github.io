'use strict';

/*
TODO:
 - add margins for track labels
 - boxplots
 - throw error when missing settings key is requested
*/

var htd3 = (function () {
  // any graph is a function that takes a d3 selection and returns a
  // function initialised with said selection.
  var graphs = {};

  function generateScaleX (extent, settings) {
    var padded_extent = [ extent[0] - settings.padding.x,
                          extent[1] + settings.padding.x ];

    return d3.scale.linear()
      .domain(padded_extent)
      .range([0, settings.width]);
  };

  function generateColorScale (colors) {
    return d3.scale.linear()
      .domain(d3.scale.linear().ticks(colors.length))
      .range(colors);
  };

  function getTrackLayerData (trackData, layerName) {
    var layerData = trackData
          .values
          .filter(function (x) { return x.layer === layerName; })
          .map(function (x) { return x.values; })[0];
    if (layerData === undefined) {
      layerData = [];
    }
    return { key: trackData.key, values: layerData };
  };

  // group rows by "chr" column and wrap values in layer
  function groupByTrack (rows, layerName) {
    var nested = d3.nest()
          .key(function (d) { return d.chr; })
          .entries(rows);
    return nested.map(function (d) {
      return { key: d.key, values: [{ layer: layerName, values: d.values }]};
    });
  };

  function setupTracks (selection, settings) {
    function drawTrack (d, i) {
      var context = d3.select(this);

      // draw track
      context.append('rect')
        .attr('class', 'base')
        .attr('height', settings.trackHeight)
        .attr('width', settings.width);

      // label track
      context.append('text')
        .attr('font-size', settings.trackHeight * 0.8)
        .attr('dominant-baseline', 'middle')
        .attr('x', 3)
        .attr('y', settings.trackHeight / 2);
    }

    var tracks = selection
          .selectAll('g.track')
          .data(function (d, i) { return d; });
    tracks.enter().append('g').attr('class', 'track').each(drawTrack);
    tracks.exit().remove();
    return tracks;
  };

  function updateTracksHeightAndPosition (tracks, settings) {
    var trackOffset = settings.padding.y;
    tracks.each(function (d, i) {
      var track = d3.select(this),
          computedHeight = track.node().getBBox().height,
          y = track.node().getBBox().y;

      track.attr('transform', 'translate(0,'+ (trackOffset - y) +')');
      trackOffset += computedHeight + settings.padding.y;
    });
    return trackOffset;
  };

  function drawBackground (chart, axis, height) {
    chart.select('g.grid').remove();
    chart.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(axis.tickSize(-height, 0));

    chart.select('g.axis').remove();
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axis.ticks(40).tickSize(5, 10));
  }

  /*
   oldData   : may have more than one layer
   newData   : has only one layer
   layerName : the name of the layer to copy from newData to oldData
   */
  function mergeData (oldData, newData, layerName) {
    var existingTracks = d3.set(oldData.map(function (d) { return d.key; }));

    return newData.reduce(function (acc, d) {
      var track,
          layer;

      if (existingTracks.has(d.key)) {
        track = acc.find(function (x) { return x.key === d.key; });
        layer = track.values.find(function (x) { return x.layer === layerName; });
        if (layer === undefined) {
          // add layer
          track.values = track.values.concat(d.values);
        } else {
          // overwrite existing layer; newData only contains one
          // layer, so we can access it as d.values[0]
          layer.values = d.values[0].values;
        }
      } else {
        // add new track
        acc.push(d);
      }
      return acc;
    }, oldData);
  };

  var zoomer = function (element) {
    var bbox = element.node().getBBox(),
        zoom = d3.behavior.zoom()
          .scale(1)
          .scaleExtent([1, 8.0])
          .size([bbox.width, bbox.height]);

    zoom.on('zoom', function() {
      var translation = d3.event.translate,
          scale = d3.event.scale;

      // reset viewport at scale 1
      if (scale === 1) {
        translation = [ 0, 0 ];
        // keep translation in sync
        zoom.translate(translation);
      }

      element
        .transition()
        .ease('linear')
        .duration(200)
        .attr("transform",
              "translate(" + translation + ")"+
              "scale(" + scale + ")");
    });

    zoom(element);
    return zoom;
  };

  function generateSelf (settings, chart) {
    var self = {};

    function updateDimensions () {
      // recompute height
      var computedHeight = chart.node().getBBox().height + chart.node().getBBox().y,
          margin = settings.margin;

      // style chart
      chart
        .attr('class', 'chart')
        .attr('width', settings.width)
        .attr('height', computedHeight);

      // apply margins
      if (margin === undefined) {
        margin = { top: 30, right: 30, bottom: 30, left: 30 };
      }
      chart
        .attr('transform', 'translate('+margin.left+','+margin.top+')');
      self.root
        .attr('class', 'htd3')
        .attr('width', settings.width + margin.left + margin.right)
        .attr('height', computedHeight + margin.top + margin.bottom);
    };

    // chainable getter / setter for settings
    self.settings = function (newSettings) {
      if (!arguments.length) return settings;

      for (var attrname in newSettings) {
        settings[attrname] = newSettings[attrname];
      };

      return self;
    };

    self.refresh = function (selection) {
      if (selection === undefined) {
        selection = chart;
      }

      selection.call(self.render);
      updateDimensions();

      return self;
    };

    // initialise
    self.settings(settings);

    // store parent to allow for adjustment of margins
    self.root = d3.select(chart.node().parentNode);
    zoomer(self.root);

    return self;
  };



/*
Data has genomic locations and associated scores for each location
across multiple tissues. It has also a "type" column which serves as a
layer; the heatmap will display the selected type only.

There can be any number of columns containing scores; they may have
arbitrary headers.
*/

/*
chr	start	end	type	tissue1	tissue2	tissue3
chr1	230	250	chia-pet	10	1	10.5
chr1	300	320	chia-pet	1	2	3
chr1	450	480	chia-pet	3	4	5
chr1	230	250	predicted	2	20	6
chr1	300	320	predicted	12	34	32
chr1	450	480	predicted	5	10	23
*/

// TODO: add colour legend

  graphs.heatmap = function (selection) {
    var chart = selection,
        settings = {
          animation: {
            duration: 200
          },
          colors: {
            score: ['red', 'black', 'green']
          },
          extent: undefined,
          width: 800,
          padding: { x: 50, y: 50 },
          paddingTick: 15,
          trackHeight: 15,
          boxHeight: 15,
          boxGap: 1
        },
        self = generateSelf(settings, selection);

    self.render = function (selection) {
      var priv = {},
          min = self.data.scores_min,
          max = self.data.scores_max,
          sortOrder = null,
          extent = (settings.extent !== undefined) ? settings.extent : self.data.x_extent,
          tracks = setupTracks(selection, settings),
          columns,
          trackOffset;

      // update axes and scales
      priv.scale = {
        scoreColor: generateColorScale(settings.colors.score),
        x: generateScaleX(extent, settings)
      };

      priv.axes = {
        x: d3.svg.axis()
          .scale(priv.scale.x)
          .orient("bottom")
          .tickPadding(settings.paddingTick)
          .ticks(10)
      };

      function normaliseScore (score) {
        return (score - min) / (max - min);
      };

      function drawScorebox (d, i) {
        var scorebox = d3.select(this),
            column = d3.select(this.parentNode),
            column_data = column.data()[0];

        scorebox
          .transition()
          .duration(settings.animation.duration)
          .attr('fill', priv.scale.scoreColor(normaliseScore(d.value)))
          .attr('height', settings.boxHeight)
          .attr('width', priv.scale.x(column_data.end) - priv.scale.x(column_data.start))
          .attr('x', priv.scale.x(column_data.start))
          .attr('y', settings.trackHeight + i * (settings.boxHeight + settings.boxGap))
          .attr('title', d.key + ", score: " + d.value);

        // on click: sort by ascending score in region
        scorebox.on('click', function () {
          sortOrder = d3.entries(column.datum().scores)
            .sort(function (a,b) {
              if (a.value > b.value) { return 1;  }
              if (a.value < b.value) { return -1; }
              return 0;
            })
            .map(function (pair) { return pair.key; });
          updateScoreboxes();
        });
      }

      columns = tracks
        .selectAll('g.heatcolumn')
        .data(function (d, i) { return getTrackLayerData(d, 'heatmap').values; });
      columns.enter().append('g').attr('class', 'heatcolumn');
      columns.exit().remove();

      function updateScoreboxes () {
        var sorter = function (d, i) {
          var sorted;

          if (sortOrder === null) {
            sorted = d3.entries(d.scores);
          } else {
            sorted = sortOrder.reduce(function (acc, key) {
              acc.push({'key': key, 'value': d.scores[key]});
              return acc;
            }, []);
          }
          return sorted;
        };

        var scoreboxes = columns
              .selectAll('rect.scorebox')
              .data(sorter,
                    function (d) { return d.key; });
        scoreboxes.enter().append('rect').attr('class', 'scorebox');
        scoreboxes.exit().remove();
        scoreboxes.each(drawScorebox);
      }

      updateScoreboxes();
      trackOffset = updateTracksHeightAndPosition(tracks, settings);
      drawBackground(chart, priv.axes.x, trackOffset);
    };

    // load tab-separated data from URL or JSON array
    self.load = function (url_or_data) {
      // TODO: filter by type before bind; we only display one type at one time
      var converter = (function () {
        var header = "";
        return function (row, i) {
          if (i === 0) {
            header = row;
            return null;
          } else {
            return {
              chr:    row.shift(),
              start: +row.shift(),
              end:   +row.shift(),
              type:   row.shift(),
              scores: row.reduce(function (acc, score, i) {
                acc[header[i+4]] = +score;
                return acc;
              }, {})
            };
          };
        };
      })();

      function store (data) {
        self.data = {};

        // gather x values and scores for scale
        var layerData = data.map(function (d) { return getTrackLayerData(d, 'heatmap').values; }),
            flattened = d3.merge(layerData),
            xs = d3.merge(flattened.map(function (d) { return [+d.start, +d.end]; })),
            scores = d3.merge(flattened.map(function (d) { return d3.values(d.scores); })),
            score_range = d3.extent(scores);

        self.data.x_extent = d3.extent(xs);
        self.data.scores_min = score_range[0];
        self.data.scores_max = score_range[1];

        return data;
      };

      function postProcessing (data) {
        var boundData = chart.data()[0];
        data = groupByTrack(data, 'heatmap');

        // merge the new data with possibly existing data
        if (boundData !== undefined) {
          data = mergeData(boundData, data, 'heatmap');
        }

        store(data);
        self.refresh(chart.data([data]));
      };

      if (typeof(url_or_data) === 'object') {
        postProcessing(url_or_data);
      } else {
        // fetch file from URL, convert data and bind grouped data
        d3.xhr(url_or_data, "text/plain", function (response) {
          var contents = response.responseText,
              rows = d3.tsv.parseRows(contents, converter);
          postProcessing(rows);
        });
      }

      return self;
    };

    return self;
  };


/*chr	start	end	name	score	strand	thickStart	thickEnd	itemRgb	blockCount	blockSizes	blockStarts
chr11	31487851	31762649	NM_001288726	0	+	31487907	31761553	0	12	279,36,122,132,140,85,189,109,107,289,139,1133,	0,10327,29933,85041,94039,117381,122488,138013,140387,172059,253683,273665,
chr11	31487851	31762649	NM_001288725	0	+	31487907	31761662	0	11	279,36,122,132,143,85,189,109,107,139,1133,	0,10327,29933,85041,94036,117381,122488,138013,140387,253683,273665,
chr11	31487851	31762649	NM_019040	0	+	31487907	31761648	0	10	279,36,122,132,140,85,189,109,107,1133,	0,10327,29933,85041,94039,117381,122488,138013,140387,273665,
chr11	31762915	31789266	NM_001258465	0	-	31768057	31784535	0	12	5228,151,116,151,83,159,166,216,131,61,77,315,	0,5918,8646,8860,9240,9838,15899,16769,17912,21610,22057,26036,
chr11	31762915	31789477	NM_001258464	0	-	31768057	31784535	0	13	5228,151,116,151,83,159,166,216,131,61,77,188,141,	0,5918,8646,8860,9240,9838,15899,16769,17912,21610,22057,26036,26421,
chr11	31762915	31790307	NM_001258463	0	-	31768057	31784535	0	14	5228,151,116,151,83,159,166,216,42,131,61,77,188,91,	0,5918,8646,8860,9240,9838,15899,16769,17079,17912,21610,22057,26036,27301,
chr11	31762915	31796085	NM_001258462	0	-	31768057	31784535	0	14	5228,151,116,151,83,159,166,216,42,131,61,77,188,153,	0,5918,8646,8860,9240,9838,15899,16769,17079,17912,21610,22057,26036,33017,
chr11	31762915	31796085	NM_001127612	0	-	31768057	31784535	0	13	5228,151,116,151,83,159,166,216,131,61,77,188,153,	0,5918,8646,8860,9240,9838,15899,16769,17912,21610,22057,26036,33017,
chr11	31762915	31789477	NM_001604	0	-	31768057	31784535	0	14	5228,151,116,151,83,159,166,216,42,131,61,77,188,141,	0,5918,8646,8860,9240,9838,15899,16769,17079,17912,21610,22057,26036,26421,
chr11	31762915	31789477	NM_000280	0	-	31768057	31784535	0	13	5228,151,116,151,83,159,166,216,131,61,77,188,239,	0,5918,8646,8860,9240,9838,15899,16769,17912,21610,22057,26036,26323,
chr11	31794689	31865163	NR_033971	0	+	31865163	31865163	0	3	74,81,1501,	0,68726,68973,
chr11	31804689	31807426	NR_117094	0	+	31807426	31807426	0	1	2737,	0,
*/
  graphs.exonintron = function (selection) {
    var chart = selection,
        settings = {
          extent: undefined,
          trackHeight: 15,
          gap: 2,
          width: 800,
          padding: { x: 50, y: 50 },
          paddingTick: 15,
          collapseTracks: false
        },
        self = generateSelf(settings, selection);

    // load tab-separated data from URL or JSON array
    self.load = function (url_or_data) {
      // convert some fields to numbers
      function converter (d) {
        return {
          chr:          d.chr,
          start:       +d.start,
          end:         +d.end,
          name:         d.name,
          thickStart:  +d.thickStart,
          thickEnd:    +d.thickEnd,
          blockSizes:   d.blockSizes.split(',').splice(0, +d.blockCount).map(function (d) { return +d; }),
          blockStarts:  d.blockStarts.split(',').splice(0, +d.blockCount).map(function (d) { return +d; })
        };
      };

      function store (data) {
        self.data = {};

        // gather x values and scores for scale
        var layerData = data.map(function (d) { return getTrackLayerData(d, 'exonintron').values; }),
            flattened = d3.merge(layerData),
            xs = d3.merge(flattened.map(function (d) { return [+d.start, +d.end, +d.thickStart, +d.thickEnd]; }));
        self.data.x_extent = d3.extent(xs);
        return data;
      };

      function postProcessing (data) {
        data = groupByTrack(data, 'exonintron');
        store(data);
        self.refresh(chart.data([data]));
      };

      if (typeof(url_or_data) === 'object') {
        postProcessing(url_or_data);
      } else {
        // fetch file from URL, convert data and bind grouped data
        d3.tsv(url_or_data, converter, postProcessing);
      }

      return self;
    };

    self.render = function (selection) {
      var priv = {},
          min = self.data.scores_min,
          max = self.data.scores_max,
          extent = (settings.extent !== undefined) ? settings.extent : self.data.x_extent,
          tracks = setupTracks(selection, settings),
          trackOffset,
          strips;

      // update axes and scales
      priv.scale = {
        x: generateScaleX(extent, settings)
      };

      priv.axes = {
        x: d3.svg.axis()
          .scale(priv.scale.x)
          .orient("bottom")
          .tickPadding(settings.paddingTick)
          .ticks(10)
      };

      // draw associations
      // TODO: do not append if exists!
      function drawExonIntron (d, i) {
        var context = d3.select(this);

        // outer dimensions for each strip
        if (!settings.collapseTracks) {
          context.append('rect')
            .attr('x', priv.scale.x(d.start))
            .attr('width', priv.scale.x(d.end) - priv.scale.x(d.start))
            .attr('class', 'outer')
            .attr('height', settings.trackHeight);
        }

        d3.zip(d.blockStarts, d.blockSizes).forEach(function (pair) {
          var xstart = d.start + pair[0],
              xend = xstart + pair[1];

          context.append('rect')
            .attr('x', priv.scale.x(xstart))
            .attr('width', priv.scale.x(xend) - priv.scale.x(xstart))
            .attr('height', settings.trackHeight)
            .attr('fill', 'red');
        });
      }

      // fan out vertically
      function spreadStrips (d, i) {
        var context = d3.select(this),
            y = settings.collapseTracks ? 0 : i * (settings.trackHeight + settings.gap);

        context.attr('transform', 'translate(0,'+ y +')');
      }

      // strips containing the actual exon/intron blocks defined in blockSizes/blockStarts
      strips = tracks
        .selectAll('g.strip')
        .data(function (d, i) { return getTrackLayerData(d, 'exonintron').values; });
      strips.enter().append('g').attr('class', 'strip').each(drawExonIntron);
      strips.exit().remove();
      strips.each(spreadStrips);

      strips.on('click', function () {
        settings.collapseTracks = !settings.collapseTracks;
        self.refresh();
      });

      trackOffset = updateTracksHeightAndPosition(tracks, settings);
      drawBackground(chart, priv.axes.x, trackOffset);
    };

    return self;
  };

  // visualisation of associations between regions
  graphs.associations = function (selection) {
    var chart = selection,
        settings = {
          animation: {
            groupDelay: 300,
            trackDelay: 200
          },
          colors: {
            score: ['red', 'black', 'green']
          },
          extent: undefined,
          legendHeight: 20,
          trackHeight: 15,
          linkRadiusRatio: 0.8,
          width: 800,
          padding: { x: 50, y: 50 },
          paddingTick: 15
        },
        self = generateSelf(settings, selection);

    // private functions
    self.render = (function () {
      var priv = {};

      function drawLegend (selection, min, max) {
        var legend = selection.append('g').attr('class', 'legend'),
            gradientId,
            gradient = legend.append('defs').append('linearGradient'),
            node,
            offset = 0,
            legendPadding = 4,
            percent,
            i;

        // build gradient stops from colors
        for (i=0; i <= settings.colors.score.length; i++) {
          percent = i/settings.colors.score.length;
          gradient.append('stop')
            .attr('offset', (100*percent) + '%')
            .attr('stop-color', priv.scale.linkColor(percent) );
        };

        // give the gradient a unique id
        gradientId = 'linearGradient_' + settings.colors.score.join('_');
        gradient.attr('id', gradientId),

        // place minimum value text to the left...
        node = legend.append('text')
          .text(min)
          .attr('dominant-baseline', 'middle')
          .attr('x', legendPadding)
          .attr('y', settings.legendHeight / 2);
        offset += node.node().getBBox().width + legendPadding * 2;

        // ...the gradient box in the middle...
        node = legend.append('rect')
          .attr('fill', 'url(#'+gradientId+')')
          .attr('height', settings.legendHeight)
          .attr('width', 100)
          .attr('x', offset);
        offset += node.node().getBBox().width + legendPadding;

        // ...and the maximum value text on the right.
        legend.append('text')
          .text(max)
          .attr('dominant-baseline', 'middle')
          .attr('x', offset)
          .attr('y', settings.legendHeight / 2);
      }

      // draw associations in the current track
      function updateTrack (d, i) {
        var context = d3.select(this),
            associations,
            min = self.data.scores_min,
            max = self.data.scores_max;

        function normaliseScore (score) {
          return (score - min) / (max - min);
        };

        // draw an association between two regions
        function drawAssociation (d, i) {
          // prepare data structure for link rendering
          var group = d3.select(this),
              linkObjects = {
                source: {
                  x0: priv.scale.x(d.start),
                  x1: priv.scale.x(d.end)
                },
                target: {
                  x0: priv.scale.x(d.targetStart),
                  x1: priv.scale.x(d.targetEnd)
                }
              };

          // clear existing stuff
          group.selectAll('rect.region').remove();
          group.selectAll('path.link').remove();

          // draw region rectangle
          group.append('rect')
            .attr('class', 'region source')
            .attr('height', settings.trackHeight)
            .attr('width', priv.scale.x(d.end) - priv.scale.x(d.start))
            .attr('x', priv.scale.x(d.start))
            .attr('title', 'source: ' + d.start + ':' + d.end);

          // draw target rectangle
          group.append('rect')
            .attr('class', 'region target')
            .attr('height', settings.trackHeight)
            .attr('width', priv.scale.x(d.targetEnd) - priv.scale.x(d.targetStart))
            .attr('x', priv.scale.x(d.targetStart))
            .attr('title', 'target: ' + d.targetStart + ':' + d.targetEnd);

          // draw link to target region on same track
          group.append('path')
            .attr('class', 'link')
            .attr('d', linkPath(linkObjects))
            .style({fill: priv.scale.linkColor(normaliseScore(d.score))})
            .attr('title', 'score: '+d.score);

          // bring group to the top on hover
          group.on('mouseover', function () {
            var parent = d3.select(this.parentNode),
                removed = group.classed({'selected': true}).remove();
            parent.append(function () { return removed.node(); });
          });
          group.on('mouseleave', function () {
            group.classed({'selected': false});
          });
        }

        // TODO: this doesn't really belong here
        // update the title of the track base and the label
        context.select('rect.base').attr('title', d.key);
        context.select('text').text(d.key);

        // draw regions with associations for this track
        associations = context
          .selectAll('g.association')
          .data(d.values);

        associations.enter()
          .append('g')
          .attr('class', 'association');
        associations.exit().remove();
        associations.each(drawAssociation);

        // fade in
        associations
          .attr('opacity', 0)
          .transition()
          .delay(function (d, assoc_id) {
            var del = (assoc_id + 1) * settings.animation.groupDelay + i * settings.animation.trackDelay;
            return del;
          })
          .duration(500)
          .attr('opacity', 1);
      }

      // generate link path
      function linkPath (d) {
        var left = d.target,
            right = d.source,
            ry = settings.linkRadiusRatio;

        // swap target and source to simplify drawing
        if (d.source.x0 < d.target.x0) {
          left  = d.source;
          right = d.target;
        }

        return 'M' + left.x0 + ',0 ' // start at left edge
          + 'A1,' + ry + ' 0 0,1 '   // radius x/y, axis rotation, large-arc-flag, sweep-flag
          + right.x1 + ',0 '         // target of outer arc
          + 'L' + right.x0 + ',0 '   // line from target right to left
          + 'A1,' + ry + ' 0 0,0 '   // radius x/y, axis rotation, large-arc-flag, sweep-flag
          + left.x1  + ",0 z";       // target of inner arc
      }

      // return actual render function
      return function (selection) {
        var computedHeight,
            trackOffset = 0,
            extent = (settings.extent !== undefined) ? settings.extent : self.data.x_extent,
            tracks = setupTracks(selection, settings);

        // update axes and scales
        priv.scale = {
          linkColor: generateColorScale(settings.colors.score),
          x: generateScaleX(extent, settings)
        };

        priv.axes = {
          x: d3.svg.axis()
            .scale(priv.scale.x)
            .orient("bottom")
            .tickPadding(settings.paddingTick)
            .ticks(10)
        };

        // Draw the contents of each track.
        tracks.each(function (d, i) {
          updateTrack.bind(this)(getTrackLayerData(d, 'associations'), i);
        });

        trackOffset = updateTracksHeightAndPosition(tracks, settings);
        drawBackground(chart, priv.axes.x, trackOffset);

        // draw legend
        chart.select('g.legend').remove();
        chart.call(drawLegend, self.data.scores_min, self.data.scores_max);
        return self;
      };
    })();

    // load tab-separated data from URL or JSON array
    self.load = function (url_or_data) {
      // convert some fields to numbers
      function converter (d) {
        return {
          chr:          d.chr,
          start:       +d.start,
          end:         +d.end,
          targetChr:    d.targetChr,
          targetStart: +d.targetStart,
          targetEnd:   +d.targetEnd,
          score:       +d.associationScore
        };
      };

      function postProcessing (data) {
        var boundData = chart.data()[0];
        data = groupByTrack(data, 'associations');

        // merge the new data with possibly existing data
        if (boundData !== undefined) {
          data = mergeData(boundData, data, 'associations');
        }

        // gather x values and scores for scale
        self.data = {};
        var layerData = data.map(function (d) { return getTrackLayerData(d, 'associations').values; }),
            flattened = d3.merge(layerData),
            xs = d3.merge(flattened.map(function (d) { return [+d.start, +d.end, +d.targetStart, +d.targetEnd]; })),
            scores = flattened.map(function (d) { return +d.score; }),
            score_range = d3.extent(scores);

        self.data.x_extent = d3.extent(xs);
        self.data.scores_min = score_range[0];
        self.data.scores_max = score_range[1];

        // bind (merged) data and refresh
        self.refresh(chart.data([data]));
      };

      if (typeof(url_or_data) === 'object') {
        postProcessing(url_or_data);
      } else {
        // fetch file from URL, convert data and bind grouped data
        d3.tsv(url_or_data, converter, postProcessing);
      }

      return self;
    };

    return self;
  };
  

  // like associations but the height of the arc encodes the score
  graphs.sushi = function (selection) {
    var chart = selection,
        settings = {
          animation: {
            groupDelay: 300,
            trackDelay: 200
          },
          colors: {
            score: ['red', 'black', 'green']
          },
          extent: undefined,
          legendHeight: 20,
          trackHeight: 15,
          linkRadiusRatio: 0.8,
          width: 800,
          padding: { x: 50, y: 50 },
          paddingTick: 15
        },
        self = generateSelf(settings, selection);

    // private functions
    self.render = (function () {
      var priv = {};

      function drawLegend (selection, min, max) {
        var legend = selection.append('g').attr('class', 'legend'),
            gradientId,
            gradient = legend.append('defs').append('linearGradient'),
            node,
            offset = 0,
            legendPadding = 4,
            percent,
            i;

        // build gradient stops from colors
        for (i=0; i <= settings.colors.score.length; i++) {
          percent = i/settings.colors.score.length;
          gradient.append('stop')
            .attr('offset', (100*percent) + '%')
            .attr('stop-color', priv.scale.linkColor(percent) );
        };

        // give the gradient a unique id
        gradientId = 'linearGradient_' + settings.colors.score.join('_');
        gradient.attr('id', gradientId),

        // place minimum value text to the left...
        node = legend.append('text')
          .text(min)
          .attr('dominant-baseline', 'middle')
          .attr('x', legendPadding)
          .attr('y', settings.legendHeight / 2);
        offset += node.node().getBBox().width + legendPadding * 2;

        // ...the gradient box in the middle...
        node = legend.append('rect')
          .attr('fill', 'url(#'+gradientId+')')
          .attr('height', settings.legendHeight)
          .attr('width', 100)
          .attr('x', offset);
        offset += node.node().getBBox().width + legendPadding;

        // ...and the maximum value text on the right.
        legend.append('text')
          .text(max)
          .attr('dominant-baseline', 'middle')
          .attr('x', offset)
          .attr('y', settings.legendHeight / 2);
      }

      // draw associations in the current track
      function updateTrack (d, i) {
        var context = d3.select(this),
            associations,
            min = self.data.scores_min,
            max = self.data.scores_max;

        function normaliseScore (score) {
          return (score - min) / (max - min);
        };

        // draw an association between two regions
        function drawAssociation (d, i) {
          // prepare data structure for link rendering
          var group = d3.select(this),
              linkObjects = {
                source: {
                  x0: priv.scale.x(d.start),
                  x1: priv.scale.x(d.end)
                },
                target: {
                  x0: priv.scale.x(d.targetStart),
                  x1: priv.scale.x(d.targetEnd)
                }
              };

          // clear existing stuff
          group.selectAll('rect.region').remove();
          group.selectAll('path.link').remove();

          // draw region rectangle
          group.append('rect')
            .attr('class', 'region source')
            .attr('height', settings.trackHeight)
            .attr('width', priv.scale.x(d.end) - priv.scale.x(d.start))
            .attr('x', priv.scale.x(d.start))
            .attr('title', 'source: ' + d.start + ':' + d.end);

          // draw target rectangle
          group.append('rect')
            .attr('class', 'region target')
            .attr('height', settings.trackHeight)
            .attr('width', priv.scale.x(d.targetEnd) - priv.scale.x(d.targetStart))
            .attr('x', priv.scale.x(d.targetStart))
            .attr('title', 'target: ' + d.targetStart + ':' + d.targetEnd);

          // draw link to target region on same track
          group.append('path')
            .attr('class', 'link')
            .attr('d', linkPath(linkObjects))
            .style({fill: priv.scale.linkColor(normaliseScore(d.score))})
            .attr('title', 'score: '+d.score);

          // bring group to the top on hover
          group.on('mouseover', function () {
            var parent = d3.select(this.parentNode),
                removed = group.classed({'selected': true}).remove();
            parent.append(function () { return removed.node(); });
          });
          group.on('mouseleave', function () {
            group.classed({'selected': false});
          });
        }

        // TODO: this doesn't really belong here
        // update the title of the track base and the label
        context.select('rect.base').attr('title', d.key);
        context.select('text').text(d.key);

        // draw regions with associations for this track
        associations = context
          .selectAll('g.association')
          .data(d.values);

        associations.enter()
          .append('g')
          .attr('class', 'association');
        associations.exit().remove();
        associations.each(drawAssociation);

        // fade in
        associations
          .attr('opacity', 0)
          .transition()
          .delay(function (d, assoc_id) {
            var del = (assoc_id + 1) * settings.animation.groupDelay + i * settings.animation.trackDelay;
            return del;
          })
          .duration(500)
          .attr('opacity', 1);
      }

      // generate link path
      function linkPath (d) {
        var left = d.target,
            right = d.source,
            ry = settings.linkRadiusRatio;

        // swap target and source to simplify drawing
        if (d.source.x0 < d.target.x0) {
          left  = d.source;
          right = d.target;
        }

        return 'M' + left.x0 + ',0 ' // start at left edge
          + 'A1,' + ry + ' 0 0,1 '   // radius x/y, axis rotation, large-arc-flag, sweep-flag
          + right.x1 + ',0 '         // target of outer arc
          + 'L' + right.x0 + ',0 '   // line from target right to left
          + 'A1,' + ry + ' 0 0,0 '   // radius x/y, axis rotation, large-arc-flag, sweep-flag
          + left.x1  + ",0 z";       // target of inner arc
      }

      // return actual render function
      return function (selection) {
        var computedHeight,
            trackOffset = 0,
            extent = (settings.extent !== undefined) ? settings.extent : self.data.x_extent,
            tracks = setupTracks(selection, settings);

        // update axes and scales
        priv.scale = {
          linkColor: generateColorScale(settings.colors.score),
          x: generateScaleX(extent, settings)
        };

        priv.axes = {
          x: d3.svg.axis()
            .scale(priv.scale.x)
            .orient("bottom")
            .tickPadding(settings.paddingTick)
            .ticks(10)
        };

        // Draw the contents of each track.
        tracks.each(function (d, i) {
          updateTrack.bind(this)(getTrackLayerData(d, 'associations'), i);
        });

        trackOffset = updateTracksHeightAndPosition(tracks, settings);
        drawBackground(chart, priv.axes.x, trackOffset);

        // draw legend
        chart.select('g.legend').remove();
        chart.call(drawLegend, self.data.scores_min, self.data.scores_max);
        return self;
      };
    })();

    // load tab-separated data from URL or JSON array
    self.load = function (url_or_data) {
      // convert some fields to numbers
      function converter (d) {
        return {
          chr:          d.chr,
          start:       +d.start,
          end:         +d.end,
          targetChr:    d.targetChr,
          targetStart: +d.targetStart,
          targetEnd:   +d.targetEnd,
          score:       +d.associationScore
        };
      };

      function postProcessing (data) {
        var boundData = chart.data()[0];
        data = groupByTrack(data, 'associations');

        // merge the new data with possibly existing data
        if (boundData !== undefined) {
          data = mergeData(boundData, data, 'associations');
        }

        // gather x values and scores for scale
        self.data = {};
        var layerData = data.map(function (d) { return getTrackLayerData(d, 'associations').values; }),
            flattened = d3.merge(layerData),
            xs = d3.merge(flattened.map(function (d) { return [+d.start, +d.end, +d.targetStart, +d.targetEnd]; })),
            scores = flattened.map(function (d) { return +d.score; }),
            score_range = d3.extent(scores);

        self.data.x_extent = d3.extent(xs);
        self.data.scores_min = score_range[0];
        self.data.scores_max = score_range[1];

        // bind (merged) data and refresh
        self.refresh(chart.data([data]));
      };

      if (typeof(url_or_data) === 'object') {
        postProcessing(url_or_data);
      } else {
        // fetch file from URL, convert data and bind grouped data
        d3.tsv(url_or_data, converter, postProcessing);
      }

      return self;
    };

    return self;
  };

  graphs.box = function (selection) {
    var chart = selection,
        settings = {
          animation: {
            groupDelay: 300,
            trackDelay: 200
          },
          colors: {
            score: ['red', 'black', 'green']
          },
          iqr: 1.5,
          extent: undefined,
          legendHeight: 20,
          trackHeight: 15,
          linkRadiusRatio: 0.8,
          width: 800,
          height: 600,
          padding: { x: 50, y: 50 },
          paddingTick: 15
        },
        self = generateSelf(settings, selection);

    // private functions
    self.render = function (selection) {
      // function to compute the interquartile range
      function iqr(k) {
        return function(d, i) {
          var q1 = d.quartiles[0],
              q3 = d.quartiles[2],
              iqr = (q3 - q1) * k,
              i = -1,
              j = d.length;
          while (d[++i] < q1 - iqr);
          while (d[--j] > q3 + iqr);
          return [i, j];
        };
      }

      // TODO: support margins
      var chart = d3.chart.box()
            .whiskers(iqr(settings.iqr))
            .width(settings.width)
            .height(settings.height);
      selection.call(chart);

      return self;
    };

    // load tab-separated data from URL or JSON array
    self.load = function (url_or_data) {
      // convert some fields to numbers
      function converter (d) {
        return {
          chr:          d.chr,
          start:       +d.start,
          end:         +d.end,
          targetChr:    d.targetChr,
          targetStart: +d.targetStart,
          targetEnd:   +d.targetEnd,
          score:       +d.associationScore
        };
      };

      function postProcessing (data) {
        var boundData = chart.data()[0];
        data = groupByTrack(data, 'associations');

        // merge the new data with possibly existing data
        if (boundData !== undefined) {
          data = mergeData(boundData, data, 'associations');
        }

        // gather x values and scores for scale
        self.data = {};
        var layerData = data.map(function (d) { return getTrackLayerData(d, 'associations').values; }),
            flattened = d3.merge(layerData),
            xs = d3.merge(flattened.map(function (d) { return [+d.start, +d.end, +d.targetStart, +d.targetEnd]; })),
            scores = flattened.map(function (d) { return +d.score; }),
            score_range = d3.extent(scores);

        self.data.x_extent = d3.extent(xs);
        self.data.scores_min = score_range[0];
        self.data.scores_max = score_range[1];

        // bind (merged) data and refresh
        self.refresh(chart.data([data]));
      };

      if (typeof(url_or_data) === 'object') {
        postProcessing(url_or_data);
      } else {
        // fetch file from URL, convert data and bind grouped data
        d3.tsv(url_or_data, converter, postProcessing);
      }

      return self;
    };

    return self;
  };


  // initialise the specified graph. Takes an optional _target element
  // to hold the graph.
  function htd3 (graph_name, _target) {
    var graph = graphs[graph_name],
        target;

    if (graph && typeof(graph) === 'function') {
      target = d3.select(_target || 'body').append('svg').append('g');
      return graph(target);
    } else {
      console.log("ERROR: unknown graph '"+graph_name+"'.");
      return undefined;
    }
  };

  // expose graphs
  htd3.graphs = graphs;
  return htd3;
})();
