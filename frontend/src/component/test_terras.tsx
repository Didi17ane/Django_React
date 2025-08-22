import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";

interface ExtractedData {
  name: string;
  id_number: string;
  birth_date: string;
  end_date: string;
  nationality: string;
  gender: string;
  document_type: string;
  all_text: string;
}

const ImprovedOCRScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [extractedData, setExtractedData] = useState<Partial<ExtractedData>>({});
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prétraitement de l'image
  const preprocessImage = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ): string => {
    const width = Math.min(img.width, 1200);
    const height = (img.height * width) / img.width;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      );
      const enhanced = gray > 120 ? 255 : 0;
      data[i] = enhanced;
      data[i + 1] = enhanced;
      data[i + 2] = enhanced;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  };

  // OCR réel avec Tesseract.js
  const performRealOCR = async (imageData: string): Promise<{ all_text: string }> => {
    try {
      const result = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m),
      });
      return { all_text: result.data.text };
    } catch (err) {
      console.error("Erreur OCR frontend:", err);
      throw new Error("Erreur lors du traitement OCR côté front");
    }
  };

  // Analyse du texte extrait
  const analyzeExtractedText = (text: string): ExtractedData => {
    const lines = text.split("\n").filter((line) => line.trim().length > 2);
    const data: ExtractedData = {
      name: "",
      id_number: "",
      birth_date: "",
      end_date: "",
      nationality: "",
      gender: "",
      document_type: "",
      all_text: text,
    };

    lines.forEach((line) => {
      const cleanLine = line.trim().toUpperCase();

      if (cleanLine.includes("CARTE") && cleanLine.includes("IDENT")) {
        data.document_type = "Carte d'Identité";
      }
      if (cleanLine.includes("PASSEPORT")) {
        data.document_type = "Passeport";
      }
      if (/\d{2}\/\d{2}\/\d{4}/.test(cleanLine)) {
        data.birth_date = cleanLine.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? "";
      }
      if (/\d{2}\/\d{2}\/\d{4}/.test(cleanLine)) {
        data.end_date = cleanLine.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ?? "";
      }
      if (/^[A-Z\s]{3,}$/.test(cleanLine) && cleanLine.length > data.name.length) {
        data.name = cleanLine;
      }
      if (/N[°º]\s*[:\-]?\s*\d+/.test(cleanLine)) {
        data.id_number = cleanLine.match(/\d+/)?.[0] ?? "";
      }
      if (cleanLine.includes("FEMME") || cleanLine.includes("F")) {
        data.gender = "Féminin";
      }
      if (cleanLine.includes("HOMME") || cleanLine.includes("M")) {
        data.gender = "Masculin";
      }
    });

    return data;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide");
        return;
      }

      setError("");
      setExtractedText("");
      setExtractedData({});
      setProcessedImage(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const performOCR = async () => {
    if (!image) {
      setError("Veuillez sélectionner une image");
      return;
    }
    setIsProcessing(true);
    setError("");

    try {
      const img = new Image();
      img.onload = async () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Étape 1 : prétraitement
        const processedImageData = preprocessImage(canvas, ctx, img);
        setProcessedImage(processedImageData);

        try {
          // Étape 2 : OCR sur l’image prétraitée
          const result = await performRealOCR(processedImageData);
          setExtractedText(result.all_text);

          // Étape 3 : extraction structurée
          const structuredData = analyzeExtractedText(result.all_text);
          setExtractedData(structuredData);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erreur OCR inconnue");
          }
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = image;
    } catch (err) {
      if (err instanceof Error) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError("Erreur inconnue");
      }
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setImage(null);
    setExtractedText("");
    setExtractedData({});
    setProcessedImage(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Scanner OCR</h1>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} />

      {image && <img src={image} alt="Doc" className="w-64 mt-4" />}

      <div className="mt-4 flex gap-2">
        <button
          onClick={performOCR}
          disabled={isProcessing}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isProcessing ? "Analyse en cours..." : "Analyser le Document"}
        </button>
        <button onClick={clearAll} className="bg-gray-300 px-4 py-2 rounded">
          Effacer
        </button>
      </div>

      {processedImage && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">🖼️ Image prétraitée</h3>
          <img src={processedImage} alt="Prétraitée" className="w-64 border" />
        </div>
      )}

      {Object.keys(extractedData).length > 0 && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h3 className="font-bold text-green-700 mb-2">✨ Informations Extraites</h3>
          {extractedData.name && <p><strong>Nom:</strong> {extractedData.name}</p>}
          {extractedData.id_number && <p><strong>ID:</strong> {extractedData.id_number}</p>}
          {extractedData.birth_date && <p><strong>Date de Naissance:</strong> {extractedData.birth_date}</p>}
          {extractedData.end_date && <p><strong>Date d'expiration:</strong> {extractedData.end_date}</p>}
          {extractedData.gender && <p><strong>Sexe:</strong> {extractedData.gender}</p>}
          {extractedData.document_type && <p><strong>Type Doc:</strong> {extractedData.document_type}</p>}
        </div>
      )}

      {extractedText && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">📝 Texte Brut Extrait</h3>
          <textarea className="w-full h-40 border p-2" value={extractedText} readOnly />
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImprovedOCRScanner;




















































// import { useState } from 'react';
// import { useTesseract } from 'react-tesseract';

// const MyKadScanner = () => {
//   const [imageUrl, setImageUrl] = useState('');
//   const { recognize, result, isRecognizing, error } = useTesseract();

//   const handleRecognize = async () => {
//     if (imageUrl) {
//       await recognize(imageUrl, { language: 'eng' });
//     }
// }
//   return (
//     <div>
//       <input type="file" onChange={(e) => setImageUrl(URL.createObjectURL(e.target.files[0]))} />
//       <button onClick={handleRecognize} disabled={!imageUrl || isRecognizing}>Scan MyKad</button>
//       {error && <p>Error: {error}</p>}
//       {result && <pre>{result}</pre>}
//     </div>
//   );
// };

// export default MyKadScanner;



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


