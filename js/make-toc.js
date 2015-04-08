/*
 * GPLv3+
 * by Ricardo
 */

utils = (function () {
  var _root = 'body',
      _level = "h3";
  
  function genTOC (target) {
    collect(_root, _level).
      map(makeItem).
      each(function () {
        $(target).append(this);
      });
  }
  function makeItem () {
    item = this;
    return "<li data-magellan-arrival='" +
      item.id +
      "'><a href='#" +
      item.id +
      "'>" +
      item.text +
      "</a></li>";
  }

  function collect (root, level) {
    return $(root).
      find(level).
      map(function () {
        return {
          'id': this.id,
          'text': this.innerHTML,
        };
      });
  }
  
  return {
    genTOC: genTOC
  };
})();
