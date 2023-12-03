function onUpdated(tabId, changeInfo) {
  if (
    changeInfo.url &&
    changeInfo.url.includes('https://www.chessable.com/analysis/fen/')
  ) {
    const fenPart = changeInfo.url.split('fen/')[1];
    if (fenPart) {
      const fen = fenPart.split('/')[0];
      const formattedFen = fen.replace(/U/g, '/').replace(/%20/g, ' ');
      const lichessUrl = `https://lichess.org/analysis/standard/${formattedFen}`;
      chrome.tabs.update(tabId, { url: lichessUrl });
    }
  }
}
chrome.tabs.onUpdated.addListener(onUpdated);
