import React from 'react';

function Loading() {
  return <div>this is loading page</div>
}

export function dynamicRouter(loadRouter) {
	return class Content extends React.Component {
		state = {
			Component: null
		};
		componentDidMount() {
			if (this.state.Component) return;
      console.log(loadRouter());
			loadRouter()
				.then((module) => {
          console.log(module);
          return module.default;
        })
				.then((Component) =>
					this.setState({
						Component
					})
				);
		}
    render() {
      const { Component } = this.state;
      console.log(Component);
      return Component ? <Component { ...this.props } /> : <Loading></Loading>
    }
	};
}
