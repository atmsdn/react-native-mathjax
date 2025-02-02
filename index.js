import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { widthPercentageToDP } from 'react-native-responsive-screen';
const defaultOptions = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: {
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
	}
};

class MathJax extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 1
		};
	}

	handleMessage(message) {
		this.setState({
			height: Number(message.nativeEvent.data)
		});
	}

	wrapMathjax(content) {
		const options = JSON.stringify(
			Object.assign({}, defaultOptions, this.props.mathJaxOptions)
		);

		return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});

				MathJax.Hub.Queue(function() {
					var height = document.documentElement.scrollHeight;
					window.ReactNativeWebView.postMessage(String(height));
					document.getElementById("formula").style.visibility = '';
				});
			</script>

			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>
			<div id="formula" style="visibility: hidden;">
				<p style="font-size:${this.props.fontSize?this.props.fontSize:14}px;font-weight:${this.props.fontWeight?this.props.fontWeight:'normal'};font-family:sans serif">
					${content}
				</p>
			</div>
		`;
	}
	render() {
		const html = this.wrapMathjax(this.props.html);

		// Create new props without `props.html` field. Since it's deprecated.
		const props = Object.assign({}, this.props, { html: undefined });

		return (
			<View style={{...props.style}}>
				<AutoHeightWebView
					style={{...props.webViewStyle}}
					customStyle={`body{overflow-y: hidden`}
					scrollEnabled={false}
					onMessage={this.handleMessage.bind(this)}
					source={{ html }}
					{...props}
				/>
			</View>
		);
	}
}

export default MathJax;
