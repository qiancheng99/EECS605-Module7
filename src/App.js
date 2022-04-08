// import './App.css';
// import React from 'react';

// // atob is deprecated but this function converts base64string to text string
// const decodeFileBase64 = (base64String) => {
//   // From Bytestream to Percent-encoding to Original string
//   return "data:image/png;base64," + base64String
// //   return decodeURIComponent(
// //     atob(base64String).split("").map(function (c) {
// //       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
// //     }).join("")
// //   );
// };


// function App() {
//   const [inputFileData, setInputFileData] = React.useState(''); // represented as bytes data (string)
//   const [outputFileData, setOutputFileData] = React.useState(''); // represented as readable data (text string)
//   const [buttonDisable, setButtonDisable] = React.useState(true);
//   const [buttonText, setButtonText] = React.useState('Submit');

//   // convert file to bytes data
//   const convertFileToBytes = (inputFile) => {
//     console.log('converting file to bytes...');
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(inputFile); // reads file as bytes data

//       fileReader.onload = () => {
//         resolve(fileReader.result);
//       };

//       fileReader.onerror = (error) => {
//         reject(error);
//       };
//     });
//   }

//   // handle file input
//   const handleChange = async (event) => {
//     // Clear output text.
//     setOutputFileData("");

//     console.log('newly uploaded file');
//     const inputFile = event.target.files[0];
//     console.log(inputFile);

//     // convert file to bytes data
//     const base64Data = await convertFileToBytes(inputFile);
//     const base64DataArray = base64Data.split('base64,'); // need to get rid of 'data:image/png;base64,' at the beginning of encoded string
//     const encodedString = base64DataArray[1];
//     setInputFileData(encodedString);
//     console.log('file converted successfully');

//     // enable submit button
//     setButtonDisable(false);
//   }

//   // handle file submission
//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // temporarily disable submit button
//     setButtonDisable(true);
//     setButtonText('Loading Result');

//     // make POST request
//     console.log('making POST request...');
//     fetch('https://91p2kbuidk.execute-api.us-east-1.amazonaws.com/prod/', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Accept": "text/plain" },
//       body: JSON.stringify({ "image": inputFileData })
//     }).then(response => response.json())
//     .then(data => {
//       console.log('getting response...')
//       console.log(data);
//     setButtonText('getting response');

//       // POST request error
//       if (data.statusCode === 400) {
//         const outputErrorMessage = JSON.parse(data.errorMessage)['outputResultsData'];
//         setOutputFileData(outputErrorMessage);
//       }

//       // POST request success
//       else {
//         const outputBytesData = JSON.parse(data.body)['outputResultsData'];
//         setOutputFileData(decodeFileBase64(outputBytesData));
//       }

//       // re-enable submit button
//       setButtonDisable(false);
//       setButtonText('Submit');
//     })
//     .then(() => {
//       console.log('POST request success');
//     })
//   }

//   return (
//     <div className="App">
//       <div className="Virtual Backgrounds Demo">
//         <h1>Virtual Backgrounds Demo</h1>
//         <p>Author: Cheng Qian</p>
//         <p>Email: chengqia@umich.edu</p>
//       </div>
//       <div className="Description">
//         <h1>Description</h1>
//         <p>In the recent past, video calls have become a primary form of communication for work and school due to the  global pandemic. Virtually everyone has been forced to use their  homes as the centerpiece for their video calls. Many people are limited to the spaces with access to a computer and internet within their homes. These spaces can have distracting or unprofessional backgrounds for video calls.  To minimize the effects this can have on people working virtually, they would like the ability to change the background of their video calls to an image of their choice that best fits the scenario or environment they are in.  Thus, I develop a program which can detect people in the image and replace the background the user desires. I have used transfer learning to tune the existing resnet model to fit the human portrait.  My algorithm takes the image and feed it to this pre-trained neural network to predict the location of human portrait. Then it will mask the pixels in these locations in the desired background image, and combine this masked image with the extracted portrait to get the final output.</p>
//       </div>
//       <div className="Instructions for use">
//         <h1>Instructions for use</h1>
//         <p>The input to the algorithm should be an image containing human portrait of any image format (.jpg, .png, etc). The program will return an image with the background of the portrait replaced. </p>
//       </div>    
//       <div className="Input">
//         <h1>Input</h1>
//         <form onSubmit={handleSubmit}>
//           <input type="file" accept="image/*" onChange={handleChange} />
//           <button type="submit" disabled={buttonDisable}>{buttonText}</button>
//         </form>
//       </div>
//       <div className="Output">
//         <h1>Results</h1>
//         <img src={outputFileData} alt="" />
//       </div>
//     </div>
//   );
// }

// export default App;



import './App.css';
import React from 'react';

// global variables to change where necessary
const DROPDOWN_API_ENDPOINT = 'https://uy4t2s4kjh.execute-api.us-east-1.amazonaws.com/prod/'; // TODO
const ML_API_ENDPOINT = 'https://91p2kbuidk.execute-api.us-east-1.amazonaws.com/prod/' ; // TODO


// atob is deprecated but this function converts base64string to text string
// const decodeFileBase64 = (base64String) => {
//   // From Bytestream to Percent-encoding to Original string
//   return decodeURIComponent(
//     atob(base64String).split("").map(function (c) {
//       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join("")
//   );
// };

const decodeFileBase64 = (base64String) => {
  // From Bytestream to Percent-encoding to Original string
  return "data:image/png;base64," + base64String
};


function App() {
  const [inputFileData, setInputFileData] = React.useState(''); // represented as bytes data (string)
  const [outputFileData, setOutputFileData] = React.useState(''); // represented as readable data (text string)
  const [inputImage, setInputImage] = React.useState(''); // represented as bytes data (string)
  const [buttonDisable, setButtonDisable] = React.useState(true);
  const [submitButtonText, setSubmitButtonText] = React.useState('Submit');
  const [fileButtonText, setFileButtonText] = React.useState('Upload File');
  const [demoDropdownFiles, setDemoDropdownFiles] = React.useState([]);
  const [selectedDropdownFile, setSelectedDropdownFile] = React.useState('');

  // make GET request to get demo files on load -- takes a second to load
  React.useEffect(() => {
    fetch(DROPDOWN_API_ENDPOINT)
    .then(response => response.json())
    .then(data => {
      // GET request error
      if (data.statusCode === 400) {
        console.log('Sorry! There was an error, the demo files are currently unavailable.')
      }

      // GET request success
      else {
        const s3BucketFiles = JSON.parse(data.body);
        setDemoDropdownFiles(s3BucketFiles["s3Files"]);
      }
    });
  }, [])


  // convert file to bytes data
  const convertFileToBytes = (inputFile) => {
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
    const inputFile = event.target.files[0];

    // update file button text
    setFileButtonText(inputFile.name);

    // convert file to bytes data
    const base64Data = await convertFileToBytes(inputFile);
    setInputImage(base64Data);
    const base64DataArray = base64Data.split('base64,'); // need to get rid of 'data:image/png;base64,' at the beginning of encoded string
    const encodedString = base64DataArray[1];
    setInputFileData(encodedString);

    // enable submit button
    setButtonDisable(false);

    // clear response results
    setOutputFileData('');

    // reset demo dropdown selection
    setSelectedDropdownFile('');
  }


  // handle file submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // temporarily disable submit button
    setButtonDisable(true);
    setSubmitButtonText('Loading Result...');

    // make POST request
    fetch(ML_API_ENDPOINT, {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Accept": "text/plain" },
      body: JSON.stringify({ "image": inputFileData })
    }).then(response => response.json())
    .then(data => {
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
      setSubmitButtonText('Submit');
    })
  }


  // handle demo dropdown file selection
  const handleDropdown = (event) => {
    setSelectedDropdownFile(event.target.value);

    // temporarily disable submit button
    setButtonDisable(true);
    setSubmitButtonText('Loading Demo File...');

    // only make POST request on file selection
    if (event.target.value) {
      fetch(DROPDOWN_API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ "fileName": event.target.value })
      }).then(response => response.json())
      .then(data => {

        // POST request error
        if (data.statusCode === 400) {
          console.log('Uh oh! There was an error retrieving the dropdown file from the S3 bucket.')
        }

        // POST request success
        else {
          const dropdownFileBytesData = JSON.parse(data.body)['bytesData'];
          setInputFileData(dropdownFileBytesData);
          setInputImage('data:image/png;base64,' + dropdownFileBytesData); // hacky way of setting image from bytes data - even works on .jpeg lol
          setSubmitButtonText('Submit');
          setButtonDisable(false);
        }
      });
    }

    else {
      setInputFileData('');
    }
  }


  return (
    <div className="App">
      <div className="Virtual Backgrounds Demo">
        <h1>Virtual Backgrounds Demo</h1>
        <p>Author: Cheng Qian</p>
        <p>Email: chengqia@umich.edu</p>
      </div>
      <div className="Instructions for use">
        <h1>Instructions for use</h1>
        <p>The input to the algorithm should be an image containing human portrait of any image format (.jpg, .png, etc). The program will return an image with the background of the portrait replaced. The deatiled report can be found: <a href="https://github.com/qiancheng99/EECS605-Module7/blob/main/public/EECS_605_Project.pdf">technical report</a></p>
      </div> 
      <div className="Input">
        <h1>Input</h1>
        <label htmlFor="demo-dropdown">Demo: </label>
        <select name="Select Image" id="demo-dropdown" value={selectedDropdownFile} onChange={handleDropdown}>
            <option value="">-- Select Demo File --</option>
            {demoDropdownFiles.map((file) => <option key={file} value={file}>{file}</option>)}
        </select>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file-upload">{fileButtonText}</label>
          <input type="file" id="file-upload" onChange={handleChange} />
          <button type="submit" disabled={buttonDisable}>{submitButtonText}</button>
        </form>
        <img src={inputImage} alt="" />
      </div>
      <div className="Output">
        <h1>Results</h1>
        <img src={outputFileData} alt="" />
      </div>
    </div>
  );
}

export default App;

