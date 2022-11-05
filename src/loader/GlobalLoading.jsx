import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

GlobalLoading.propTypes = {
  loading: PropTypes.object.isRequired
};

function GlobalLoading(props) {
  const {loading} = props;
  const isLoading = !_.isEmpty(loading) ? loading.isLoading : false;
  return (
      <div className={isLoading ? 'preloader loaded' : 'd-none'}>
        <div className="lds-ellipsis">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
  );
}


const mapStateToProps = (state) => ({
  loading: state.LOADING
});

export default connect(mapStateToProps, {})(
    withRouter(GlobalLoading)
);
