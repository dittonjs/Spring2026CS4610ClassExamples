async function main() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register("/sw.js");
  }
}


window.addEventListener('load', main)

