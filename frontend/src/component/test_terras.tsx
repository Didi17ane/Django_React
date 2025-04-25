import { useState } from 'react';
import { useTesseract } from 'react-tesseract';

const MyKadScanner = () => {
  const [imageUrl, setImageUrl] = useState('');
  const { recognize, result, isRecognizing, error } = useTesseract();

  const handleRecognize = async () => {
    if (imageUrl) {
      await recognize(imageUrl, { language: 'eng' });
    }
}
  return (
    <div>
      <input type="file" onChange={(e) => setImageUrl(URL.createObjectURL(e.target.files[0]))} />
      <button onClick={handleRecognize} disabled={!imageUrl || isRecognizing}>Scan MyKad</button>
      {error && <p>Error: {error}</p>}
      {result && <pre>{result}</pre>}
    </div>
  );
};

export default MyKadScanner;



// import React, { useState } from 'react';
// import { useTesseract } from 'react-tesseract';

// const App = () => {
//   const [imageUrl, setImageUrl] = useState('');
//   const { recognize, error, result, isRecognizing } = useTesseract();

//   const handleRecognize = async () => {
//     if (imageUrl) {
//       await recognize(imageUrl, {
//         language: 'eng+ara',  // Use English and Arabic
//         errorHandler: (err) => console.error(err),  // Custom error handler
//         tessedit_ocr_engine_mode: 1,  // Use neural net LSTM engine only
//         tessedit_pageseg_mode: 1,  // Assume a single uniform block of text
//         // ... any other Tesseract.js options
//       });
//     }
//   };

//   const handleImageChange = (e) => {
//     setImageUrl(URL.createObjectURL(e.target.files[0]));
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageChange} />
//       <button onClick={handleRecognize} disabled={!imageUrl || isRecognizing}>
//         Recognize Text
//       </button>
//       {error && <p>Error: {error}</p>}
//       {result && <pre>{result}</pre>}
//     </div>
//   );
// };

// export default App;


