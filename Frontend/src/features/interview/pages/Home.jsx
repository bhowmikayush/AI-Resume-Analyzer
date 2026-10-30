 import React, { useState, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const { loading, generateReport } = useInterview();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/login');
  };

  const validateResume = (file) => {
    if (!file) return false;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      alert('Please upload a PDF file.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Your resume must be smaller than 10MB.');
      return false;
    }

    if (file.size === 0) {
      alert('The selected PDF file is empty.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file && validateResume(file)) {
      setResumeFile(file);
    } else if (file) {
      e.target.value = '';
      setResumeFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    if (!validateResume(file)) return;

    setResumeFile(file);

    try {
      const transfer = new DataTransfer();
      transfer.items.add(file);

      if (resumeInputRef.current) {
        resumeInputRef.current.files = transfer.files;
      }
    } catch (error) {
      console.warn('Could not synchronize dropped file:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();

    setResumeFile(null);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGenerating || loading) return;

    if (!jobDescription.trim()) {
      alert('Please enter the job description.');
      return;
    }

    if (!resumeFile) {
      alert('Please upload your resume in PDF format.');
      return;
    }

    if (!validateResume(resumeFile)) {
      return;
    }

    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append('jobDescription', jobDescription.trim());
      formData.append('selfDescription', selfDescription.trim());
      formData.append('resume', resumeFile);

      const data = await generateReport(formData);

      const reportId =
        data?.report?._id ||
        data?.report?.id ||
        data?._id ||
        data?.id;

      if (!reportId) {
        console.error('Unexpected report API response:', data);

        throw new Error(
          data?.message ||
          'The report response did not contain a report ID.'
        );
      }

      navigate(`/interview/${reportId}`);
    } catch (error) {
      console.error('Failed to generate interview report:', {
        status: error?.response?.status,
        response: error?.response?.data,
        message: error?.message,
      });

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to generate the report. Please try again.';

      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const busy = isGenerating || loading;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Helvetica, Arial, sans-serif;
        }

        .home-container {
          min-height: 100vh;
          background: #090b10;
          color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .btn-logout {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #e2e8f0;
          background: rgba(18, 22, 34, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #f87171;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        .ambient-glow-1,
        .ambient-glow-2 {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          pointer-events: none;
        }

        .ambient-glow-1 {
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.18) 0%,
            transparent 70%
          );
          top: -120px;
          left: -120px;
          animation: floatOrb1 12s ease-in-out infinite alternate;
        }

        .ambient-glow-2 {
          width: 540px;
          height: 540px;
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.16) 0%,
            transparent 70%
          );
          bottom: -120px;
          right: -120px;
          animation: floatOrb2 14s ease-in-out infinite alternate;
        }

        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(20px, 80px) scale(0.95); }
        }

        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -50px) scale(1.12); }
          100% { transform: translate(-80px, 20px) scale(0.92); }
        }

        .main-card {
          width: 100%;
          max-width: 1100px;
          background: rgba(18, 22, 34, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          position: relative;
          z-index: 10;
          animation: cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .header-section {
          margin-bottom: 2.5rem;
          text-align: center;
          animation: fadeInDown 0.7s ease-out forwards;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
          margin-bottom: 0.75rem;
          animation: pulseBorder 3s infinite ease-in-out;
        }

        @keyframes pulseBorder {
          0%, 100% {
            border-color: rgba(99, 102, 241, 0.3);
            box-shadow: 0 0 0 rgba(99, 102, 241, 0);
          }
          50% {
            border-color: rgba(129, 140, 248, 0.7);
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
          }
        }

        .title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 2rem;
        }

        .panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 0;
        }

        .label-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .label-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }

        .char-count {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
        }

        .custom-textarea {
          width: 100%;
          background: rgba(13, 17, 27, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 1rem 1.1rem;
          color: #f8fafc;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .custom-textarea:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .custom-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2),
            0 0 20px rgba(99, 102, 241, 0.1);
          background: rgba(15, 20, 32, 0.95);
        }

        .custom-textarea::placeholder {
          color: #475569;
        }

        .dropzone {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          background: rgba(13, 17, 27, 0.5);
          border-radius: 14px;
          padding: 1.75rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 190px;
        }

        .dropzone:hover {
          border-color: #818cf8;
          background: rgba(99, 102, 241, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15);
        }

        .dropzone.active {
          border-color: #a855f7;
          background: rgba(168, 85, 247, 0.12);
          transform: scale(1.02);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
        }

        .upload-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .dropzone:hover .upload-icon {
          background: rgba(99, 102, 241, 0.25);
        }

        .file-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.6rem;
          animation: popIn 0.3s ease;
          overflow-wrap: anywhere;
          max-width: 100%;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .remove-file {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          margin-left: 0.25rem;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .remove-file:hover {
          color: #f87171;
          transform: scale(1.2);
        }

        .btn-generate {
          margin-top: 0.5rem;
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #8b5cf6 50%,
            #ec4899 100%
          );
          background-size: 200% 200%;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          animation: gradientShift 6s ease infinite alternate;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .btn-generate::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          animation: btnShimmer 4s infinite ease-in-out;
          pointer-events: none;
        }

        @keyframes btnShimmer {
          0% { left: -70%; }
          40%, 100% { left: 140%; }
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px -4px rgba(139, 92, 246, 0.5),
            0 0 15px rgba(236, 72, 153, 0.3);
          filter: brightness(1.08);
        }

        .btn-generate:active:not(:disabled) {
          transform: translateY(1px);
        }

        .btn-generate:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 860px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .main-card {
            padding: 1.5rem;
          }

          .title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .home-container {
            padding: 1rem 0.75rem;
            padding-top: 4.5rem;
          }

          .btn-logout {
            top: 1rem;
            right: 1rem;
          }

          .main-card {
            padding: 1.1rem;
            border-radius: 18px;
          }

          .header-section {
            margin-bottom: 1.75rem;
          }

          .label-wrap {
            flex-wrap: wrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-glow-1,
          .ambient-glow-2,
          .main-card,
          .header-section,
          .badge,
          .upload-icon,
          .file-status,
          .btn-generate,
          .btn-generate::after,
          .spinner {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="home-container">
        {/* Top-Right Logout Button */}
        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>

        <div className="ambient-glow-1" aria-hidden="true" />
        <div className="ambient-glow-2" aria-hidden="true" />

        <main className="main-card">
          <header className="header-section">
            <span className="badge">
              AI Matchmaker &amp; Evaluator
            </span>

            <h1 className="title">
              Resume &amp; Job Fit Analysis
            </h1>

            <p className="subtitle">
              Paste the role requirements and upload your profile to
              generate an instant match report.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="content-grid">
            {/* Job Description */}
            <div className="panel">
              <div>
                <div className="label-wrap">
                  <label
                    htmlFor="jobDescription"
                    className="label-text"
                  >
                    Job Description
                  </label>

                  <span className="char-count">
                    {jobDescription.length} chars
                  </span>
                </div>

                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  className="custom-textarea"
                  style={{ height: '360px' }}
                  placeholder="Paste the target job description, responsibilities, and required qualifications here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Resume Upload and Self Description */}
            <div className="panel">
              <div>
                <div className="label-wrap">
                  <label htmlFor="resume" className="label-text">
                    Resume Document
                  </label>

                  <span className="char-count">
                    PDF only (max 10MB)
                  </span>
                </div>

                <div
                  className={`dropzone ${isDragging ? 'active' : ''}`}
                  onClick={() => resumeInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload resume PDF"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      resumeInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  <div className="upload-icon" aria-hidden="true">
                    📄
                  </div>

                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#e2e8f0',
                    }}
                  >
                    {resumeFile
                      ? 'Change uploaded file'
                      : 'Click to browse or drop your PDF'}
                  </span>

                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: '#64748b',
                      marginTop: '4px',
                    }}
                  >
                    Standard ATS-friendly PDF format
                  </span>

                  {resumeFile && (
                    <div
                      className="file-status"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>
                        ✓ {resumeFile.name} (
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>

                      <button
                        type="button"
                        className="remove-file"
                        onClick={handleRemoveFile}
                        aria-label="Remove uploaded resume"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Self Description */}
              <div>
                <div className="label-wrap">
                  <label
                    htmlFor="selfDescription"
                    className="label-text"
                  >
                    Self Description / Additional Notes
                  </label>

                  <span className="char-count">
                    {selfDescription.length} chars
                  </span>
                </div>

                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  className="custom-textarea"
                  style={{ height: '140px' }}
                  placeholder="Share notable achievements, career trajectory, or context not present on your resume..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              {/* Generate Report */}
              <button
                type="submit"
                className="btn-generate"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <div className="spinner" aria-hidden="true" />
                    <span>Analyzing Alignment...</span>
                  </>
                ) : (
                  <span>⚡ Generate Report</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Home;