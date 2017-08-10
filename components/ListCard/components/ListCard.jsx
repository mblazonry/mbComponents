const React = require('react'),
  ReactRedux = require('react-redux'),
  DataActions = require('../actions/dataActions.js'),
  Util = require('util');

class ListCard extends React.Component {

  // ABSTRACT OUT -----------------
  componentDidMount() {
    skuid.events.subscribe('models.cancelled', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('models.loaded', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('models.saved', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('row.created', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('row.deleted', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('row.undeleted', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
    skuid.events.subscribe('row.updated', (e) => {
      if (e.models) {
        this.props.updateState(Object.keys(e.models)[0]);
      }
    });
  }
  // -----------------------------

  render() {
    return <div>
      {Util.inspect(this.props.data)}
    </div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: state.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateState: m => dispatch(DataActions.updateState(m))
  };
};

module.exports =
        ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ListCard);
