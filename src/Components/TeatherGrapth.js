// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Widget = styled.div`
  flex: 1;
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 10px;

  a {
    color: #1E90FF; /* Ajuste a cor conforme necessário */
  }
`;

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''; // Limpa o container antes de adicionar o script

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "BINANCE:BTCUSDT|ALL"
            ],
            [
              "INDEX:BTCUSD|ALL"
            ]
          ],
          "chartOnly": false,
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "colorTheme": "dark",
          "autosize": true,
          "showVolume": false,
          "showMA": false,
          "hideDateRanges": false,
          "hideMarketStatus": false,
          "hideSymbolLogo": false,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "noTimeScale": false,
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "maLineColor": "#2962FF",
          "maLineWidth": 1,
          "maLength": 9,
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [
            "1d|1",
            "1m|30",
            "3m|60",
            "12m|1D",
            "60m|1W",
            "all|1M"
          ]
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <WidgetContainer>
      <Widget ref={container} className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </Widget>
      <Copyright className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </Copyright>
    </WidgetContainer>
  );
}

export default memo(TradingViewWidget);
