var React = require('react');

export default class Pager extends React.Component {

  constructor(props) {
    this.state = { current_page: props.currentPage || 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage) {
      this.setState({ current_page: nextProps.currentPage });
    }
  }


  render() {
    var pages = [];
    var total_pages = this.props.totalPages || 0;
    for (var i = 0; i <= total_pages; i++) {
      var label = i + 1;
      var isActive = i === this.state.current_page;
      pages.push(<li className={isActive ? 'active' : ''}><a onClick={this.handlePage.bind(this, i, null)}>{{label}}</a></li>);
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={this.state.current_page === 0 ? 'disabled' : ''}>
            <a aria-label="Previous" onClick={this.handlePage.bind(this, null, -1)}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {{pages}}
          <li className={this.state.current_page >= total_pages ? 'disabled' : ''}>
            <a aria-label="Next" onClick={this.handlePage.bind(this, null, 1)}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  handlePage(page, incriment) {
    if (page === null) {
      page = this.state.current_page + incriment;
    }
    if (page > this.props.totalPages || page < 0) {
      return;
    }
    this.setState({ current_page: page });
    this.props.onPage(page);
  }

}
