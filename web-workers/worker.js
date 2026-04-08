function doLotsOWork() {
  for (let i = 0; i < 1000000; i++) {
    // do nothing
    console.log(i);
  }
}

self.addEventListener("message", (event) => {
  console.log(event.data);
  doLotsOWork();
});
