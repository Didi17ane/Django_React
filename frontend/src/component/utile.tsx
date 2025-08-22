import React, { useState, useRef, useCallback } from "react";

const ImprovedOCRScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simuler un OCR
  const simulateOCR = useCallback(async (): Promise<Record<string, string>> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      name: "JOHN DOE",
      id_number: "123456789012",
      birth_date: "01/01/1990",
      nationality: "FRANÇAISE",
      gender: "MASCULIN",
      all_text:
        "RÉPUBLIQUE FRANÇAISE\nCARTE NATIONALE D'IDENTITÉ\nNom: JOHN DOE\nNé(e) le: 01/01/1990\nNationalité: FRANÇAISE\nSexe: M\nN°: 123456789012",
    };
  }, []);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 10MB)");
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
        const canvas = canvasRef.current;
        if (!canvas) {
          setError("Canvas introuvable");
          setIsProcessing(false);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Contexte du canvas introuvable");
          setIsProcessing(false);
          return;
        }

        const processedImageData = preprocessImage(canvas, ctx, img);
        setProcessedImage(processedImageData);

        try {
          const result = await simulateOCR();
          setExtractedText(result.all_text || "");
          setExtractedData(result);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erreur inconnue lors de l'OCR");
          }
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setError("Erreur lors du chargement de l'image");
        setIsProcessing(false);
      };

      img.src = image;
    } catch (err: unknown) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">🔍 Scanner OCR</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Aperçu"
            className="max-w-xs border rounded"
          />
          <button
            onClick={performOCR}
            disabled={isProcessing}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isProcessing ? "Analyse en cours..." : "Analyser"}
          </button>
          <button
            onClick={clearAll}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {processedImage && (
        <div className="mt-4">
          <h2 className="font-semibold">Image prétraitée</h2>
          <img
            src={processedImage}
            alt="Prétraitée"
            className="max-w-xs border rounded"
          />
        </div>
      )}

      {Object.keys(extractedData).length > 0 && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-bold mb-2">✨ Informations extraites</h2>
          <p><strong>Nom:</strong> {extractedData.name}</p>
          <p><strong>ID:</strong> {extractedData.id_number}</p>
          <p><strong>Date de naissance:</strong> {extractedData.birth_date}</p>
          <p><strong>Nationalité:</strong> {extractedData.nationality}</p>
          <p><strong>Sexe:</strong> {extractedData.gender}</p>
        </div>
      )}

      {extractedText && (
        <div className="mt-6">
          <h2 className="font-semibold">Texte brut extrait</h2>
          <textarea
            value={extractedText}
            readOnly
            className="w-full h-40 border p-2"
          />
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