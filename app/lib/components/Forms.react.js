var React = require('react');
var BS = require('react-bootstrap');

module.exports.TextInput = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="inputName" className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          <input type="text" className="form-control" name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} disabled={this.props.disabled} />
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
            <input type="checkbox" name={this.props.name} checked={this.props.checked} onChange={this.props.onChange} />
            {this.props.label}
           </label>
        </div>
      </div>
    );
  }
});

module.exports.CheckboxSimple = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="checkbox">
           <label>
            <input type="checkbox" name={this.props.name} checked={this.props.checked} onChange={this.props.onChange} />
            {this.props.label}
           </label>
        </div>
      </div>
    );
  }
});


module.exports.RadioGroup = React.createClass({

  render: function() {
    return (
      <div className="form-group">
        <label className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports.Radio = React.createClass({
  render: function() {
    return (
      <div className="radio">
        <label>
          <input type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.props.onChange} />
          {this.props.label}
        </label>
      </div>
    );
  }
});
