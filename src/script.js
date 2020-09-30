let model = null;

async function loadNeuralNet(fileJson, fileBin) {
	model = await tf.loadLayersModel(tf.io.browserFiles([fileJson, fileBin]));
}

let predict = (r) => {
	tensor = tf.tensor(r, [28, 28], 'float32');
	tensor = tf.expandDims(tensor, 0);
	return model.predict(tensor);
};

const fileInputJson = document.getElementById("fileInputJson");
const fileInputBin = document.getElementById("fileInputBin");

fileInputJson.addEventListener('change', function() {
		let fileJson = fileInputJson.files[0];

		if (fileJson.name.match(/\.(json)$/)) {
			
			document.querySelector(".upload-json").classList.add("d-none");
			document.querySelector(".upload-bin").classList.remove("d-none");
			
			fileInputBin.addEventListener('change', function() {
				let fileBin = fileInputBin.files[0];

				if (fileBin.name.match(/\.(bin)$/)) {
					model = loadNeuralNet(fileJson, fileBin);
		
					document.querySelector(".upload-bin").classList.add("d-none");
          document.querySelector(".content").classList.remove("d-none");
          
          var ctx = document.getElementById('probabilities').getContext('2d');
          
          let bar = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                  datasets: [{
                      label: 'Probabilidade',
                      backgroundColor: '#1eaedb66',
                      borderColor: '#1eaedb',
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero: true
                          }
                      }]
                  }
              }
          });
          
          document.getElementById("mnist").addEventListener("draw", (e) => {
            let softmax = predict(e.detail).dataSync();
            let preds = Array.from(softmax).map(n => parseFloat(n.toPrecision(4)));
            console.log(preds);

            let bar = Chart.Bar(ctx, {
                data: {
                  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    datasets: [{
                        data: preds,
                        label: 'Probabilidade',
                        backgroundColor: '#1eaedb66',
                        borderColor: '#1eaedb',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
          });
          
          document.getElementById("btn-clear").addEventListener("click", () => {
            sketcher.clear();
          });
				} else {
					alert("Apenas arquivos .bin são suportados");
				}
			});
		} else {
				alert("Apenas arquivos .json são suportados");
		}
});