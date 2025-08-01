import React from "react";
import { WebView } from "react-native-webview";

const LoadingSpinnerWebView = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e3e4e8;
        }
       .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
  }
  
  :root {
	--bg: #e3e4e8;
	--fg: #17181c;
	--dur: 8s;
}

  .hexagon {
	margin-bottom: 1.5em;
	overflow: hidden;
	position: relative;
	width: 15em;
	height: 15em;
}
.hexagon__group, .hexagon__sector, .hexagon__sector:before, .hexagon__sector:after {
	position: absolute;
}
.hexagon__group {
	width: 100%;
	height: 100%;
}
.hexagon__group:nth-child(2) .hexagon__sector,
.hexagon__group:nth-child(2) .hexagon__sector:before,
.hexagon__group:nth-child(2) .hexagon__sector:after {
	animation-delay: calc(var(--dur) * -1/6);
}
.hexagon__group:nth-child(3) .hexagon__sector,
.hexagon__group:nth-child(3) .hexagon__sector:before,
.hexagon__group:nth-child(3) .hexagon__sector:after {
	animation-delay: calc(var(--dur) * -2/6);
}
.hexagon__group:nth-child(4) .hexagon__sector,
.hexagon__group:nth-child(4) .hexagon__sector:before,
.hexagon__group:nth-child(4) .hexagon__sector:after {
	animation-delay: calc(var(--dur) * -3/6);
}
.hexagon__group:nth-child(5) .hexagon__sector,
.hexagon__group:nth-child(5) .hexagon__sector:before,
.hexagon__group:nth-child(5) .hexagon__sector:after {
	animation-delay: calc(var(--dur) * -4/6);
}
.hexagon__group:nth-child(6) .hexagon__sector,
.hexagon__group:nth-child(6) .hexagon__sector:before,
.hexagon__group:nth-child(6) .hexagon__sector:after {
	animation-delay: calc(var(--dur) * -5/6);
}
.hexagon__group:nth-child(odd) {
	transform: rotate(30deg);
}
.hexagon__sector, .hexagon__sector:before, .hexagon__sector:after {
	animation-duration: var(--dur);
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	/*animation-play-state: paused;*/
	width: 0.2em;
	height: 0.2em;
}
.hexagon__sector {
	animation-name: moveOut1;
	top: calc(50% - 0.1em);
	left: calc(50% - 0.1em);
}
.hexagon__sector:nth-child(2) {
	animation-name: moveOut2;
}
.hexagon__sector:nth-child(3) {
	animation-name: moveOut3;
}
.hexagon__sector:nth-child(4) {
	animation-name: moveOut4;
}
.hexagon__sector:nth-child(5) {
	animation-name: moveOut5;
}
.hexagon__sector:nth-child(6) {
	animation-name: moveOut6;
}
.hexagon__sector:before, .hexagon__sector:after {
	animation-name: ripple;
	background-color: currentColor;
	border-radius: 0.1em;
	content: "";
	display: block;
	top: 0;
	left: 0;
	transform-origin: 0.1em 0.1em;
}
.hexagon__sector:before {
	transform: rotate(-30deg)
}
.hexagon__sector:after {
	transform: rotate(-150deg)
}
/* Dark theme */
@media (prefers-color-scheme: dark) {
	:root {
		--bg: #17181c;
		--fg: #e3e4e8;
	}
}
/* Animations */
@keyframes moveOut1 {
	from { transform: translateY(0) scale(0); }
	3% { transform: translateY(0.2em) scale(1); }
	97% { transform: translateY(7.3em) scale(1); }
	to { transform: translateY(7.5em) scale(0); }
}
@keyframes moveOut2 {
	from { transform: rotate(60deg) translateY(0) scale(0); }
	3% { transform: rotate(60deg) translateY(0.2em) scale(1); }
	97% { transform: rotate(60deg) translateY(7.3em) scale(1); }
	to { transform: rotate(60deg) translateY(7.5em) scale(0); }
}
@keyframes moveOut3 {
	from { transform: rotate(120deg) translateY(0) scale(0); }
	3% { transform: rotate(120deg) translateY(0.2em) scale(1); }
	97% { transform: rotate(120deg) translateY(7.3em) scale(1); }
	to { transform: rotate(120deg) translateY(7.5em) scale(0); }
}
@keyframes moveOut4 {
	from { transform: rotate(180deg) translateY(0) scale(0); }
	3% { transform: rotate(180deg) translateY(0.2em) scale(1); }
	97% { transform: rotate(180deg) translateY(7.3em) scale(1); }
	to { transform: rotate(180deg) translateY(7.5em) scale(0); }
}
@keyframes moveOut5 {
	from { transform: rotate(240deg) translateY(0) scale(0); }
	3% { transform: rotate(240deg) translateY(0.2em) scale(1); }
	97% { transform: rotate(240deg) translateY(7.3em) scale(1); }
	to { transform: rotate(240deg) translateY(7.5em) scale(0); }
}
@keyframes moveOut6 {
	from { transform: rotate(300deg) translateY(0) scale(0); }
	3% { transform: rotate(300deg) translateY(0.2em) scale(1); }
	97% { transform: rotate(300deg) translateY(7.3em) scale(1); }
	to { transform: rotate(300deg) translateY(7.5em) scale(0); }
}
@keyframes ripple {
	from, to { width: 0.2em; }
	33% { width: 2.4em; }
}
      </style>
    </head>
    <body>
      <div id="root">
      <div className="spinner-container">
    <div className="hexagon" aria-label="Animated hexagonal ripples">
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
        <div className="hexagon__group">
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
            <div className="hexagon__sector"></div>
        </div>
    </div>
  </div>
      </div>
      <script src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
      <script>
        const LoadingSpinner = () => React.createElement(
          'div',
          { className: 'spinner-container' },
          React.createElement(
            'div',
            { className: 'hexagon', 'aria-label': 'Animated hexagonal ripples' },
            Array.from({ length: 6 }, (_, groupIndex) =>
              React.createElement(
                'div',
                { className: 'hexagon__group', key: groupIndex },
                Array.from({ length: 6 }, (_, sectorIndex) =>
                  React.createElement(
                    'div',
                    { className: 'hexagon__sector', key: sectorIndex }
                  )
                )
              )
            )
          )
        );

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(LoadingSpinner));
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      scalesPageToFit={true}
      scrollEnabled={false}
    />
  );
};

export default LoadingSpinnerWebView;
