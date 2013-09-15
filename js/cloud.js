'use strict';

define(function () {

  var Cloud = function (options) {

    var self = this;

    // defaults
    this.options = _.extend({
      el: '#cloud',
      size: [700, 300],
      font: 'Impact',
      words: []
    }, options);

    this.words = function (words) {
      self.options.words = words;
    };

    // get cloud
    this.show = function () {

      // element
      self.$el = d3.select(self.options.el).html('');

      // fontsize scale
      var fontSize  = d3.scale.log().range([15, 100]);
      var fillColor = d3.scale.category20c();

      if (self.options.words.length > 0) {
        
        // hide alert
        $('.alert').removeClass('show');

        // layout
        d3.layout.cloud()
          .size(self.options.size)
          .words(self.options.words)
          .font(self.options.font)
          .fontSize(function(d) { return fontSize(+d.size); })
          .rotate(function() { return ~~(Math.random() * 5) * 30 - 60; })
          .on("end", function (words) {

            self.$el
              .append("svg")
                .attr("width", self.options.size[0])
                .attr("height", self.options.size[1])
              .append("g")
                .attr("transform", "translate(" + (self.options.size[0]/2) + "," + (self.options.size[1]/2) + ")")

              .selectAll("text")
                .data(words)
              .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d) { return fillColor(d.text.toLowerCase()); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });

          })
          .start();

      } else {

        // show alert
        $('.alert.alert-danger').addClass('show');

      }

    };

  };

  return Cloud;

});
