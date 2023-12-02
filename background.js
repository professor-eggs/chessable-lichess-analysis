chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.url &&
    changeInfo.url.includes('https://www.chessable.com/analysis/fen/')
  ) {
    const fen = changeInfo.url.split('fen/')[1].split('/')[0];
    const formattedFen = fen.replace(/U/g, '/').replace(/%20/g, ' ');
    const lichessUrl = `https://lichess.org/analysis/standard/${formattedFen}`;
    chrome.tabs.update(tabId, { url: lichessUrl });
  }
});
