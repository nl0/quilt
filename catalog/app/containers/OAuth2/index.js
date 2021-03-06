/* OAuth2 - handler for OAuth2 callbacks */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { parse } from 'query-string';

import { getAuth, storeTokens } from 'containers/App/actions';
import Working from 'components/Working';

import messages from './messages';

export class OAuth2 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // WARN if for some reason componentWillMount event doesn't fire (it always should)
  // auth will not work. an exceptional case would be anything that causes
  // the component to remain in scope in spite of a click on Sign In;
  // but Sign In always redirects the user to a non-SPA route, so that should never happen
  componentWillMount() {
    const { dispatch, location } = this.props;

    // eslint-disable-next-line camelcase
    const { refresh_token, access_token, expires_at } = parse(location.hash);
    const { next } = parse(location.search);

    const tokens = {
      refresh_token,
      access_token,
      // eslint-disable-next-line camelcase
      expires_at: expires_at ? parseFloat(expires_at, 10) : Infinity,
    };
    dispatch(storeTokens(tokens));
    dispatch(getAuth(tokens));
    dispatch(replace(next));
  }

  render() {
    return (
      <Working>
        <FormattedMessage {...messages.header} />
      </Working>
    );
  }
}

OAuth2.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect()(OAuth2);
