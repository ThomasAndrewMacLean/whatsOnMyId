import { h, Component } from "preact";
import style from "./style";

const api =
  "https://2ufp8fiom3.execute-api.eu-west-1.amazonaws.com/dev/uploadfile";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.uploadFile = this.uploadFile.bind(this);
    // this.clear = this.clear.bind(this);
  }

  //   clear = () => {
  //     const fileInput = document.getElementById("fileinput");
  //     fileInput.value = "";
  //   };

  uploadFile = () => {
    this.setState({ loading: true });

    const fileInput = document.getElementById("fileinput");
    const canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 400;
    var ctx = canvas.getContext("2d");
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";

    var url = URL.createObjectURL(fileInput.files[0]);
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;

    const file = fileInput.files[0];
    const _this = this;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      fetch(api, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ filee: reader.result })
      })
        .then(response => response.json())
        .then(response => {
          fileInput.value = "";
          _this.setState({ loading: false });
          //console.log(JSON.parse(response.body));
          const words = JSON.parse(response.body).TextDetections.filter(
            x => x.Type === "WORD"
          );
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const positions = words.map(x => ({
            left: x.Geometry.BoundingBox.Left,
            right: x.Geometry.BoundingBox.Left + x.Geometry.BoundingBox.Width,
            top: x.Geometry.BoundingBox.Top,
            bottom: x.Geometry.BoundingBox.Top + x.Geometry.BoundingBox.Height
          }));

          const left = positions.map(x => x.left);
          const right = positions.map(x => x.right);
          const top = positions.map(x => x.top);
          const bottom = positions.map(x => x.bottom);

          const smallX = Math.min(...left, ...right);
          const bigX = Math.max(...left, ...right);
          const smallY = Math.min(...top, ...bottom);
          const bigY = Math.max(...top, ...bottom);

          const ratioX = 1 / (bigX - smallX);
          const ratioY = 1 / (bigY - smallY);
          console.log(smallX, bigX, smallY, bigY);
          console.log(ratioX);

          //ctx.translate(smallX * ratioX, -(smallY * ratioY));
          //ctx.scale(ratioX, ratioY);

          words.forEach(word => {
            ctx.fillText(
              word.DetectedText,
              canvas.width * word.Geometry.BoundingBox.Left,
              canvas.height *
                (word.Geometry.BoundingBox.Top +
                  word.Geometry.BoundingBox.Height)
            );
          });
          //debugger;
          //  ctx.translate(panX, panY);
        });
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  };

  render() {
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>This is the Home component.</p>
        <input id="fileinput" type="file" onChange={this.uploadFile} />
        {this.state.loading && <p>Loading...</p>}
        {/* <button onClick={this.clear}>t</button> */}
        <div>
          <canvas id="canvas" class={style.canvas} />
        </div>
      </div>
    );
  }
}

export default Home;
