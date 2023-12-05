document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('goBackButton')
    .addEventListener('click', function () {
      chrome.runtime.sendMessage({ goBackToChessable: true });
    });
  document.getElementById('clearButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({ clearData: true });
  });
});
