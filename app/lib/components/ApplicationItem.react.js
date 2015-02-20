var React = require('react');


var ApplicationItem = React.createClass({
  render: function() {
    return (
      <div>
        <a href="{loginUrl}"><img src="/img/logos/{logo}" /></a>
        <a class="name" href="{loginUrl}">{name}</a>
      </div>
    );
  }
});

module.exports = ApplicationItem;
