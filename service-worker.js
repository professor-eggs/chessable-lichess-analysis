async function redirectChessableToLichess(tabId, changeInfo) {
  if (
    changeInfo.url &&
    changeInfo.url.includes('https://www.chessable.com/analysis/fen/')
  ) {
    const { redirects } = await chrome.storage.local.get('redirects');
    console.log(
      '🚀 ~ file: service-worker.js:7 ~ redirectChessableToLichess ~ redirects:',
      redirects
    );

    const { fen, orientation } = chessableUrlToFen(changeInfo.url);
    if (redirects[fen] !== undefined && redirects[fen] === false) {
      return;
    }

    const url = fenToLichessUrl(fen, orientation);

    redirects[fen] = {
      fen,
      orientation,
      enabled: true,
    };

    chrome.storage.local.set({ redirects });

    chrome.tabs.update(tabId, { url });
  }
}

chrome.tabs.onUpdated.addListener(redirectChessableToLichess);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.goBackToChessable) {
    const currentTab = await getCurrentTab();

    const { fen, orientation } = lichessUrlToFen(currentTab.url);
    const { redirects } = await chrome.storage.local.get('redirects');
    console.log(
      '🚀 ~ file: service-worker.js:39 ~ chrome.runtime.onMessage.addListener ~ redirects:',
      redirects
    );

    if (redirects[fen]) {
      const url = fenToChessableUrl(fen, orientation);

      redirects[fen].enabled = false;
      console.log(
        '🚀 ~ file: service-worker.js:45 ~ chrome.runtime.onMessage.addListener ~ redirects:',
        redirects
      );

      await chrome.storage.local.set({ redirects });

      chrome.tabs.update(currentTab.id, { url });
    }
  }

  if (message.clearData) {
    chrome.storage.local.clear();
  }
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function chessableUrlToFen(url) {
  const fenPart = url.split('/fen/')[1].split('/')[0];
  const fen = decodeURIComponent(fenPart.replace(/U/g, '/'));

  const orientation = url.includes('?o=black')
    ? 'black'
    : url.includes('?o=white')
    ? 'white'
    : undefined;
  return { fen, orientation };
}

function lichessUrlToFen(url) {
  const fenPart = url.split('/standard/')[1].split('?')[0];
  const fen = decodeURIComponent(fenPart);
  const orientation = url.includes('color=black')
    ? 'black'
    : url.includes('color=white')
    ? 'white'
    : undefined;
  return { fen, orientation };
}

function fenToChessableUrl(fen, orientation) {
  const formattedFen = encodeURIComponent(fen.replace(/\//g, 'U'));
  let url = `https://www.chessable.com/analysis/fen/${formattedFen}/`;
  if (orientation) {
    url += `?o=${orientation}`;
  }
  return url;
}

function fenToLichessUrl(fen, orientation) {
  const formattedFen = encodeURIComponent(fen);
  let url = `https://lichess.org/analysis/standard/${formattedFen}`;
  if (orientation) {
    if (orientation) url += `?color=${orientation}`;
  }
  return url;
}
