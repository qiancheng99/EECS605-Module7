import './App.css';
import React from 'react';

// atob is deprecated but this function converts base64string to text string
const decodeFileBase64 = (base64String) => {
  // From Bytestream to Percent-encoding to Original string
  return "data:image/png;base64," + base64String
//   return decodeURIComponent(
//     atob(base64String).split("").map(function (c) {
//       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join("")
//   );
};


function App() {
  const [inputFileData, setInputFileData] = React.useState(''); // represented as bytes data (string)
  const [outputFileData, setOutputFileData] = React.useState(''); // represented as readable data (text string)
  const [buttonDisable, setButtonDisable] = React.useState(true);
  const [buttonText, setButtonText] = React.useState('Submit');

  // convert file to bytes data
  const convertFileToBytes = (inputFile) => {
    console.log('converting file to bytes...');
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(inputFile); // reads file as bytes data

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  // handle file input
  const handleChange = async (event) => {
    // Clear output text.
    setOutputFileData("");

    console.log('newly uploaded file');
    const inputFile = event.target.files[0];
    console.log(inputFile);

    // convert file to bytes data
    const base64Data = await convertFileToBytes(inputFile);
    const base64DataArray = base64Data.split('base64,'); // need to get rid of 'data:image/png;base64,' at the beginning of encoded string
    const encodedString = base64DataArray[1];
    setInputFileData(encodedString);
    console.log('file converted successfully');

    // enable submit button
    setButtonDisable(false);
  }

  // handle file submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // temporarily disable submit button
    setButtonDisable(true);
    setButtonText('Loading Result');

    // make POST request
    console.log('making POST request...');
    fetch('https://91p2kbuidk.execute-api.us-east-1.amazonaws.com/prod/', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Accept": "text/plain" },
      body: JSON.stringify({ "image": inputFileData })
    }).then(response => response.json())
    .then(data => {
      console.log('getting response...')
      console.log(data);
    setButtonText('getting response');

      // POST request error
      if (data.statusCode === 400) {
        const outputErrorMessage = JSON.parse(data.errorMessage)['outputResultsData'];
        setOutputFileData(outputErrorMessage);
      }

      // POST request success
      else {
        const outputBytesData = JSON.parse(data.body)['outputResultsData'];
        setOutputFileData(decodeFileBase64(outputBytesData));
      }

      // re-enable submit button
      setButtonDisable(false);
      setButtonText('Submit');
    })
    .then(() => {
      console.log('POST request success');
    })
  }

  return (
    <div className="App">
      <div className="Virtual Backgrounds Demo">
        <h1>Description</h1>
        <p>"Author: Cheng Qian"</p>
        <p>"Email: chengqia@umich.edu"</p>
      </div>
      <div className="Description">
        <h1>Description</h1>
        <p>In the recent past, video calls have become a primary form of communication for work and school due to the  global pandemic. Virtually everyone has been forced to use their  homes as the centerpiece for their video calls. Many people are limited to the spaces with access to a computer and internet within their homes. These spaces can have distracting or unprofessional backgrounds for video calls.  To minimize the effects this can have on people working virtually, they would like the ability to change the background of their video calls to an image of their choice that best fits the scenario or environment they are in.  Thus, I develop a program which can detect people in the image and replace the background the user desires. I have used transfer learning to tune the existing resnet model to fit the human portrait.  My algorithm takes the image and feed it to this pre-trained neural network to predict the location of human portrait. Then it will mask the pixels in these locations in the desired background image, and combine this masked image with the extracted portrait to get the final output.</p>
      </div>
      <div className="Instructions for use">
        <h1>Description</h1>
        <p>The input to the algorithm should be an image containing human portrait of any image format. The program will return an image with the background of the portrait replaced. </p>
      </div>    
      <div className="Input">
        <h1>Input</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleChange} />
          <button type="submit" disabled={buttonDisable}>{buttonText}</button>
        </form>
      </div>
      <div className="Output">
        <h1>Results</h1>
        <img src={outputFileData} width="450" height="600" alt="" />
      </div>
    </div>
  );
}

export default App;
