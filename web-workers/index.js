const worker = new Worker('worker.js');
let newWindow;

worker.onmessage = function (event) {
  console.log('Message from worker:', event.data);
};

function doLotsOWork() {
  worker.postMessage('Start doing lots of work!');
}


function sendMessage() {
  document.getElementById('newWindow').contentWindow.postMessage('Hello from the main window!', '*');
}
