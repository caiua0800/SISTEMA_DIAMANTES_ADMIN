import React, { useEffect, useRef, memo } from 'react';

import styled from 'styled-components';

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "OANDA:XAUUSD|1M"
            ]
          ],
          "chartOnly": false,
          "width": "100%",
          "height": "100%",
          "locale": "br",
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
          ],
          "dateFormat": "dd/MM/yyyy"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <TradinfWidgetContaier ref={container}>
      <TradinfWidgetContaierWidget></TradinfWidgetContaierWidget>
      <div className="tradingview-widget-copyright">
        <a href="https://br.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Monitore todos os mercados no TradingView</span>
        </a>
      </div>
    </TradinfWidgetContaier>
  );
}

export default memo(TradingViewWidget);


const TradinfWidgetContaier = styled.div`
    width: 100%;
    height: 500px;
    position: relative;
`;

const TradinfWidgetContaierWidget = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
`;


