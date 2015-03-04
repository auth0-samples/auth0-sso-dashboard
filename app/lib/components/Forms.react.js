var React = require('react');

module.exports.TextInput = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label for="inputName" className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          <input type="text" className="form-control" name={this.props.name} placeholder={this.props.placeholder} />
        </div>
      </div>
    );
  }
});

module.exports.Checkbox = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="col-lg-2"></div>
        <div className="checkbox col-lg-10">
           <label>
            <input type="checkbox" name={this.props.name} /> {this.props.label}
           </label>
        </div>
      </div>
    );
  }
});
