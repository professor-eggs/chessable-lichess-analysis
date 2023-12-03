function onUpdated(tabId, changeInfo) {
  if (
    changeInfo.url &&
    changeInfo.url.includes('https://www.chessable.com/analysis/fen/')
  ) {
    const urlParts = changeInfo.url.split('fen/');
    if (urlParts.length > 1) {
      const fenPart = urlParts[1].split('/')[0];
      const formattedFen = fenPart.replace(/U/g, '/').replace(/%20/g, ' ');

      // Extracting the color parameter
      const colorParam = changeInfo.url.includes('?o=black')
        ? 'black'
        : 'white';

      // Constructing the Lichess URL with the color parameter
      const lichessUrl = `https://lichess.org/analysis/standard/${formattedFen}?color=${colorParam}`;

      chrome.tabs.update(tabId, { url: lichessUrl });
    }
  }
}

chrome.tabs.onUpdated.addListener(onUpdated);
