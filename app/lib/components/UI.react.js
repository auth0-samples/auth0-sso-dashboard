var React = require('react');
var BS = require('react-bootstrap');


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

module.exports.PromptModal = React.createClass({
  render: function() {
    return(
      <BS.Modal {...this.props} title="Modal heading" animation={false} title="New Role">
        <div className="modal-body">
          <p>{this.props.message}</p>
        </div>
        <div className="modal-footer">
          <BS.Button className="btn btn-primary" onClick={this.props.onRequestHide}>No</BS.Button>
          <BS.Button onClick={this.handleAcceptDialog}>Yes</BS.Button>
        </div>
      </BS.Modal>
    )
  },

  handleAcceptDialog: function() {
    this.props.onAcceptDialog();
    this.props.onRequestHide();
  }

});
