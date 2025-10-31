import { useState, useMemo } from 'react';
import { Download, Database, Settings, FileText } from 'lucide-react';
import { DataGenerator } from './dataGenerator';
import { CSVExporter } from './csvExporter';
import type { GenerationConfig, CSVFileType } from './types';

function App() {
  const [config, setConfig] = useState<GenerationConfig>({
    numStudents: '500',
    numTeachers: '25',
    numSchools: '3',
    numSections: '50',
    numStaff: '15',
    schoolDistrict: 'Example District',
    schoolYear: '2025-2026',
    emailDomain: 'exampledistrict.com'
  });

  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewType, setPreviewType] = useState<CSVFileType>('students');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const validateConfig = () => {
    const newErrors: { [key: string]: string } = {};
    if (!config.schoolDistrict.trim()) newErrors.schoolDistrict = "District name is required.";
    if (!config.schoolYear) newErrors.schoolYear = "School year is required.";
    if (!config.emailDomain.trim()) newErrors.emailDomain = "Email domain is required.";
    if (!config.numSchools || isNaN(Number(config.numSchools)) || Number(config.numSchools) < 1) newErrors.numSchools = "Must be at least 1 school.";
    if (!config.numStudents || isNaN(Number(config.numStudents)) || Number(config.numStudents) < 1) newErrors.numStudents = "Must be at least 1 student.";
    if (!config.numTeachers || isNaN(Number(config.numTeachers)) || Number(config.numTeachers) < 1) newErrors.numTeachers = "Must be at least 1 teacher.";
    if (!config.numSections || isNaN(Number(config.numSections)) || Number(config.numSections) < 1) newErrors.numSections = "Must be at least 1 section.";
    if (!config.numStaff || isNaN(Number(config.numStaff)) || Number(config.numStaff) < 1) newErrors.numStaff = "Must be at least 1 staff member.";
    return newErrors;
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const validationErrors = validateConfig();
    setErrors(validationErrors);
    setStatus({ type: null, message: '' });
    if (Object.keys(validationErrors).length > 0) {
      // Focus first invalid field
      const firstKey = Object.keys(validationErrors)[0];
      setTimeout(() => {
        document.getElementById(firstKey)?.focus();
      }, 0);
      return;
    }

    setIsGenerating(true);
    try {
      const generator = new DataGenerator({
        ...config,
        numStudents: Number(config.numStudents),
        numTeachers: Number(config.numTeachers),
        numSchools: Number(config.numSchools),
        numSections: Number(config.numSections),
        numStaff: Number(config.numStaff),
      });
      const data = generator.generateAllData();
      setGeneratedData(data);
      setStatus({ type: 'success', message: 'Data generated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Error generating data. Please try again.' });
      console.error('Error generating data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportAll = async () => {
    if (generatedData) {
      await CSVExporter.exportAllAsZip(generatedData, config.schoolDistrict);
    }
  };

  const handleExportSingle = (fileType: CSVFileType) => {
    if (generatedData && generatedData[fileType]) {
      CSVExporter.exportToCSV(
        generatedData[fileType],
        fileType,
        `${fileType}.csv`
      );
    }
  };

  const preview = useMemo(() => {
    if (!generatedData || !generatedData[previewType]) return "";
    return CSVExporter.previewCSV(generatedData[previewType], previewType);
  }, [generatedData, previewType]);

  // (className variables removed; use static strings inline)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-50 flex flex-col items-center font-sans py-10">
      <div className="w-full flex-1 flex flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center flex flex-col items-center">
          <div className="mb-4">
            <img src="/vite.svg" alt="App Logo" className="h-16 w-16 rounded-full shadow-sm bg-white p-2 border-4 border-slate-200" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Example District Generator
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Generate realistic SFTP CSV files for district integration testing
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 w-full max-w-5xl mx-auto lg:grid-cols-[minmax(340px,_380px)_minmax(0,_540px)] lg:justify-center">
          {/* Configuration Panel */}
          <div className="flex flex-col items-stretch">
            <form
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm hover:shadow-md transition w-full"
              onSubmit={handleGenerate}
              noValidate
              aria-labelledby="config-form-title"
            >
              <div className="flex flex-col items-start mb-6">
                <Settings className="h-5 w-5 text-indigo-400 mb-1" aria-hidden="true" focusable="false" />
                <h2 id="config-form-title" className="text-xl font-semibold text-slate-900">
                  Configuration
                </h2>
              </div>

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  Please fix the highlighted fields below.
                </div>
              )}

              {/* Status Banner */}
              {status.type && (
                <div
                  className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'border border-green-200 bg-green-50 text-green-700'
                      : 'border border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {status.message}
                </div>
              )}

              <div className="space-y-5">
                {/* District Info Section */}
                <fieldset className="mb-2 border-0 p-0">
                  <legend className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-2 px-0">
                    <span>District info</span>
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="schoolDistrict" className="block text-sm font-medium text-slate-900 mb-1">
                        District Name
                      </label>
                      <input
                        id="schoolDistrict"
                        type="text"
                        value={config.schoolDistrict}
                        placeholder="e.g. Example District"
                        onChange={(e) => setConfig({ ...config, schoolDistrict: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.schoolDistrict}
                        aria-describedby="districtNameHelp"
                      />
                      <div id="districtNameHelp" className="text-xs text-slate-500 mt-1">
                        The name of your school district.
                      </div>
                      {errors.schoolDistrict && (
                        <div className="text-xs text-rose-600 mt-1">{errors.schoolDistrict}</div>
                      )}
                    </div>
                    <div className="sm:max-w-xs">
                      <label htmlFor="schoolYear" className="block text-sm font-medium text-slate-900 mb-1">
                        School Year
                      </label>
                      <select
                        id="schoolYear"
                        value={config.schoolYear}
                        onChange={(e) => setConfig({ ...config, schoolYear: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.schoolYear}
                        aria-describedby="schoolYearHelp"
                      >
                        <option value="2025-2026">2025-2026</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2026-2027">2026-2027</option>
                        <option value="2027-2028">2027-2028</option>
                      </select>
                      <div id="schoolYearHelp" className="text-xs text-slate-500 mt-1">
                        The academic year for the generated data.
                      </div>
                      {errors.schoolYear && (
                        <div className="text-xs text-rose-600 mt-1">{errors.schoolYear}</div>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="emailDomain" className="block text-sm font-medium text-slate-900 mb-1">
                        Email Domain
                      </label>
                      <input
                        id="emailDomain"
                        type="text"
                        value={config.emailDomain}
                        placeholder="e.g. exampledistrict.com"
                        onChange={(e) => setConfig({ ...config, emailDomain: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.emailDomain}
                        aria-describedby="emailDomainHelp"
                      />
                      <div id="emailDomainHelp" className="text-xs text-slate-500 mt-1">
                        Domain for all generated email addresses (e.g., john.doe@exampledistrict.com).
                      </div>
                      {errors.emailDomain && (
                        <div className="text-xs text-rose-600 mt-1">{errors.emailDomain}</div>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* Counts Section */}
                <fieldset className="border-0 p-0">
                  <legend className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-2 px-0">
                    <span>Counts</span>
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="numSchools" className="block text-sm font-medium text-slate-900 mb-1">
                        Schools
                      </label>
                      <input
                        id="numSchools"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.numSchools}
                        placeholder="e.g. 3"
                        onChange={(e) => setConfig({ ...config, numSchools: e.target.value.replace(/[^0-9]/g, '') })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.numSchools}
                        aria-describedby="numSchoolsHelp"
                      />
                      <div id="numSchoolsHelp" className="text-xs text-slate-500 mt-1">
                        Total number of schools in the district.
                      </div>
                      {errors.numSchools && (
                        <div className="text-xs text-rose-600 mt-1">{errors.numSchools}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="numStudents" className="block text-sm font-medium text-slate-900 mb-1">
                        Students
                      </label>
                      <input
                        id="numStudents"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.numStudents}
                        placeholder="e.g. 500"
                        onChange={(e) => setConfig({ ...config, numStudents: e.target.value.replace(/[^0-9]/g, '') })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.numStudents}
                        aria-describedby="numStudentsHelp"
                      />
                      <div id="numStudentsHelp" className="text-xs text-slate-500 mt-1">
                        Total number of students to generate.
                      </div>
                      {errors.numStudents && (
                        <div className="text-xs text-rose-600 mt-1">{errors.numStudents}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="numTeachers" className="block text-sm font-medium text-slate-900 mb-1">
                        Teachers
                      </label>
                      <input
                        id="numTeachers"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.numTeachers}
                        placeholder="e.g. 25"
                        onChange={(e) => setConfig({ ...config, numTeachers: e.target.value.replace(/[^0-9]/g, '') })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.numTeachers}
                        aria-describedby="numTeachersHelp"
                      />
                      <div id="numTeachersHelp" className="text-xs text-slate-500 mt-1">
                        Total number of teachers to generate.
                      </div>
                      {errors.numTeachers && (
                        <div className="text-xs text-rose-600 mt-1">{errors.numTeachers}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="numSections" className="block text-sm font-medium text-slate-900 mb-1">
                        Sections
                      </label>
                      <input
                        id="numSections"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.numSections}
                        placeholder="e.g. 50"
                        onChange={(e) => setConfig({ ...config, numSections: e.target.value.replace(/[^0-9]/g, '') })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.numSections}
                        aria-describedby="numSectionsHelp"
                      />
                      <div id="numSectionsHelp" className="text-xs text-slate-500 mt-1">
                        Total number of sections to generate.
                      </div>
                      {errors.numSections && (
                        <div className="text-xs text-rose-600 mt-1">{errors.numSections}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="numStaff" className="block text-sm font-medium text-slate-900 mb-1">
                        Staff
                      </label>
                      <input
                        id="numStaff"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={config.numStaff}
                        placeholder="e.g. 15"
                        onChange={(e) => setConfig({ ...config, numStaff: e.target.value.replace(/[^0-9]/g, '') })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100"
                        aria-invalid={!!errors.numStaff}
                        aria-describedby="numStaffHelp"
                      />
                      <div id="numStaffHelp" className="text-xs text-slate-500 mt-1">
                        Total number of staff to generate.
                      </div>
                      {errors.numStaff && (
                        <div className="text-xs text-rose-600 mt-1">{errors.numStaff}</div>
                      )}
                    </div>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-5 rounded-xl shadow-sm hover:shadow-md transition focus:outline-none focus:ring-4 focus:ring-indigo-200 font-bold flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Generate Data"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Database className="h-6 w-6 mr-3" aria-hidden="true" focusable="false" />
                      Generate data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Panel */}
          <div className="flex flex-col gap-8 w-full">
            {generatedData && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col items-start">
                    <FileText className="h-5 w-5 text-indigo-400 mb-1" aria-hidden="true" focusable="false" />
                    <h2 className="text-xl font-semibold text-slate-900">Generated Data</h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      type="button"
                      onClick={handleExportAll}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-xl shadow-sm hover:shadow-md transition focus:outline-none focus:ring-4 focus:ring-indigo-200 flex items-center font-semibold"
                    >
                      <Download className="h-5 w-5 mr-2" aria-hidden="true" focusable="false" />
                      Download ZIP Archive
                    </button>
                    <p className="text-xs text-slate-500 mt-2">
                      Includes: schools.csv, teachers.csv, students.csv, sections.csv, enrollments.csv, staff.csv
                    </p>
                  </div>
                </div>

                {/* File Type Selector */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label htmlFor="previewType" className="block text-base font-semibold text-slate-900 mb-1 sm:mb-0">
                    Preview File Type:
                  </label>
                  <select
                    id="previewType"
                    value={previewType}
                    onChange={(e) => setPreviewType(e.target.value as CSVFileType)}
                    className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 ring-indigo-100 bg-white text-slate-900 font-semibold"
                  >
                    <option value="students">Students ({generatedData.students?.length || 0})</option>
                    <option value="teachers">Teachers ({generatedData.teachers?.length || 0})</option>
                    <option value="schools">Schools ({generatedData.schools?.length || 0})</option>
                    <option value="sections">Sections ({generatedData.sections?.length || 0})</option>
                    <option value="enrollments">Enrollments ({generatedData.enrollments?.length || 0})</option>
                    <option value="staff">Staff ({generatedData.staff?.length || 0})</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleExportSingle(previewType)}
                    className="bg-white border border-slate-300 text-indigo-700 py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition focus:outline-none focus:ring-4 focus:ring-indigo-200 font-semibold sm:ml-3 flex items-center"
                  >
                    <Download className="h-5 w-5 mr-2" aria-hidden="true" focusable="false" />
                    Download CSV
                  </button>
                </div>

                {/* Preview */}
                <div className="border rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-slate-50 px-4 py-2 border-b">
                    <h3 className="text-base font-semibold text-slate-900">
                      CSV Preview - First 5 rows
                    </h3>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs bg-slate-50 p-3 rounded-lg overflow-x-auto text-slate-900 font-mono">
                      {preview}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {!generatedData && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center w-full">
                {/* Friendly Illustration */}
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="mx-auto mb-4" aria-hidden="true" focusable="false">
                  <ellipse cx="48" cy="80" rx="32" ry="8" fill="#e0e7ff" />
                  <rect x="20" y="32" width="56" height="32" rx="8" fill="#c7d2fe" />
                  <rect x="28" y="40" width="40" height="16" rx="4" fill="#fff" />
                  <rect x="36" y="48" width="24" height="4" rx="2" fill="#a5b4fc" />
                  <circle cx="48" cy="36" r="8" fill="#6366f1" />
                  <circle cx="48" cy="36" r="4" fill="#fff" />
                </svg>
                <h3 className="text-base font-semibold text-slate-900">No files yet</h3>
                <p className="text-slate-500">
                  Fill out the form and click <span className="font-bold text-indigo-600">“Generate data”</span>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-400 text-base font-medium">
          <p>
            Generates district-compatible CSV files for integration testing.<br />
            <span className="text-slate-500">All data is randomly generated and not based on real individuals.</span>
            <br />
            <a
              href="https://github.com/legertom/example-district-generator"
              className="text-indigo-500 font-semibold hover:text-indigo-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              View the project on GitHub
            </a>
            <br />
            <span className="block mt-4 text-slate-400 text-sm font-normal">
              Built with <a href="https://vitejs.dev" className="text-indigo-500 font-semibold hover:text-indigo-600" target="_blank" rel="noopener noreferrer">Vite</a>
              &nbsp;&middot;&nbsp;
              Hosted on <a href="https://vercel.com" className="text-indigo-500 font-semibold hover:text-indigo-600" target="_blank" rel="noopener noreferrer">Vercel</a>
              &nbsp;&middot;&nbsp;
              Made with <span className="text-rose-500" role="img" aria-label="love">♥️</span> in NYC
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
