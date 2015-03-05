var React = require('react');


module.exports.PageHeader = React.createClass({
  render: function() {
    return (
      <div className="row page-header">
        <div className="col-md-8">
          <h2>{this.props.title}</h2>
        </div>
        <div className="col-md-4">
          {this.props.children}
        </div>
      </div>
    );
  }
});
