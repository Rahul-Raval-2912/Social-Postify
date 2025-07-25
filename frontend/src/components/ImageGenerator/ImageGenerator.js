import React, { useState } from 'react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ImageGenerator = ({ setCurrentPage }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);

  const promptSuggestions = [
    '🌅 Beautiful sunset over mountains',
    '🏙️ Modern city skyline at night',
    '🌸 Cherry blossoms in spring',
    '🚀 Futuristic space station',
    '🎨 Abstract colorful artwork',
    '🏖️ Tropical beach paradise',
    '🍕 Delicious food photography',
    '💼 Professional business meeting',
    '🎉 Celebration party scene',
    '🌿 Peaceful nature landscape'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your image');
      return;
    }

    setLoading(true);
    try {
      const response = await postsAPI.generateImage(prompt);
      setGeneratedImage({
        base64: response.data.image_base64,
        prompt: prompt,
        timestamp: new Date().toISOString()
      });
      toast.success('Image generated successfully! 🎨');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveImage = () => {
    if (generatedImage) {
      const newSavedImages = [...savedImages, generatedImage];
      setSavedImages(newSavedImages);
      localStorage.setItem('savedImages', JSON.stringify(newSavedImages));
      toast.success('Image saved to your gallery! 💾');
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage.base64}`;
      link.download = `generated-image-${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded! 📥');
    }
  };

  const useImageForPost = () => {
    if (generatedImage) {
      localStorage.setItem('generatedImageForPost', JSON.stringify(generatedImage));
      setCurrentPage('create-post');
      toast.info('Image ready for your post! 📝');
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('savedImages');
    if (saved) {
      setSavedImages(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="image-generator-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back
        </button>
        <div className="page-title">
          <h1>🎨 AI Image Generator</h1>
          <p>Create stunning visuals with artificial intelligence</p>
        </div>
      </div>

      <div className="generator-container">
        <div className="generator-section">
          <div className="prompt-section">
            <h3>✨ Describe Your Image</h3>
            <div className="prompt-input-container">
              <textarea
                placeholder="Describe the image you want to create... Be creative and detailed!"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="prompt-textarea"
                rows="4"
              />
              <div className="prompt-actions">
                <button 
                  className="generate-btn"
                  onClick={generateImage}
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner">🔄</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      🎨 Generate Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="suggestions-section">
            <h4>💡 Need inspiration? Try these:</h4>
            <div className="suggestions-grid">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {generatedImage && (
            <div className="generated-result">
              <h3>🖼️ Generated Image</h3>
              <div className="result-container">
                <div className="generated-image">
                  <img 
                    src={`data:image/png;base64,${generatedImage.base64}`} 
                    alt="Generated" 
                  />
                  <div className="image-overlay">
                    <div className="image-actions">
                      <button 
                        className="action-btn save-btn"
                        onClick={saveImage}
                        title="Save to Gallery"
                      >
                        💾
                      </button>
                      <button 
                        className="action-btn download-btn"
                        onClick={downloadImage}
                        title="Download"
                      >
                        📥
                      </button>
                      <button 
                        className="action-btn use-btn"
                        onClick={useImageForPost}
                        title="Use for Post"
                      >
                        📝
                      </button>
                    </div>
                  </div>
                </div>
                <div className="image-info">
                  <p><strong>Prompt:</strong> {generatedImage.prompt}</p>
                  <p><strong>Generated:</strong> {new Date(generatedImage.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {savedImages.length > 0 && (
          <div className="gallery-section">
            <h3>🖼️ Your Gallery</h3>
            <div className="gallery-grid">
              {savedImages.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img 
                    src={`data:image/png;base64,${image.base64}`} 
                    alt={`Generated ${index + 1}`}
                  />
                  <div className="gallery-overlay">
                    <button 
                      className="gallery-action"
                      onClick={() => {
                        localStorage.setItem('generatedImageForPost', JSON.stringify(image));
                        setCurrentPage('create-post');
                      }}
                    >
                      Use for Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="generator-tips">
        <h4>💡 Tips for Better Results</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h5>Be Specific</h5>
            <p>Include details like colors, style, mood, and setting</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎨</span>
            <h5>Art Styles</h5>
            <p>Try "photorealistic", "cartoon", "oil painting", "digital art"</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🌈</span>
            <h5>Add Mood</h5>
            <p>Use words like "vibrant", "peaceful", "dramatic", "cozy"</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📐</span>
            <h5>Composition</h5>
            <p>Mention "close-up", "wide shot", "from above", "side view"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;