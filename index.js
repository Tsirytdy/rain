const myImage = new Image();
// myImage.src = '';
const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", () => {
    myImage.src = `${reader.result}`;

    myImage.addEventListener("load", () => {
      const welcome = document.querySelector(".welcome");
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const container = document.querySelector(".container");
      let quote = document.getElementById("quote");
      let author = document.getElementById("author");

      const url = "https://api.quotable.io/random";

      function getQuote() {
        fetch(url)
          .then((data) => data.json())
          .then((item) => {
            quote.innerText = item.content;
            author.innerText = item.author || "Unknown";
          });
      }

      welcome.style.display = "none";
      canvas.style.display = "block";
      canvas.width = myImage.width;
      canvas.height = myImage.height;

      ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let particulesArray = [];
      const numberofParticules = 7000;
      let mappedImage = [];

      for (let y = 0; y < canvas.height; y++) {
        let row = [];
        for (let x = 0; x < canvas.width; x++) {
          const red = pixels.data[y * 4 * canvas.width + 4 * x + 0];
          const green = pixels.data[y * 4 * canvas.width + 4 * x + 1];
          const blue = pixels.data[y * 4 * canvas.width + 4 * x + 2];
          const brightness = relativeBrightness(red, green, blue);
          const cell = [(cellbrightness = brightness)];
          row.push(cell);
        }
        mappedImage.push(row);
      }

      function relativeBrightness(red, green, blue) {
        return (
          Math.sqrt(
            red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114,
          ) / 100
        );
      }

      class Particules {
        constructor(x, y) {
          this.x = Math.random() * canvas.width;
          this.y = 0;
          this.speed = 0;
          this.velocity = Math.random() * 2;
          this.size = Math.random() * 1;
          this.position1 = Math.floor(this.y);
          this.position2 = Math.floor(this.x);
        }
        update() {
          this.position1 = Math.floor(this.y);
          this.position2 = Math.floor(this.x);
          this.speed = mappedImage[this.position1][this.position2][0];
          let movement = 2.5 - this.speed + this.velocity;

          this.y += movement;
          if (this.y >= canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
          }
        }
        draw() {
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function init() {
        for (let i = 0; i < numberofParticules; i++) {
          particulesArray.push(new Particules());
        }
      }
      init();

      function animate() {
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = "rgb(0, 0 ,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < particulesArray.length; i++) {
          particulesArray[i].update();
          ctx.globalAlpha = particulesArray[i].speed * 0.5;
          particulesArray[i].draw();
        }
        requestAnimationFrame(animate);
      }
      animate();
      container.style.display = "block";
      getQuote();
    });
  });
});
