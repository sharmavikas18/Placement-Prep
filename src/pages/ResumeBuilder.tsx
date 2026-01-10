import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type FormData = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
};

const ResumeBuilder = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [formData, setFormData] = useState<FormData | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
  };

  const generatePDF = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="p-6">
      {!formData && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg mx-auto space-y-4"
        >
          <input
            {...register("name")}
            placeholder="Full Name"
            className="w-full p-2 border"
            required
          />
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-2 border"
            required
          />
          <input
            {...register("phone")}
            placeholder="Phone"
            className="w-full p-2 border"
            required
          />
          <textarea
            {...register("summary")}
            placeholder="Professional Summary"
            className="w-full p-2 border"
            rows={3}
          />
          <textarea
            {...register("education")}
            placeholder="Education"
            className="w-full p-2 border"
            rows={3}
          />
          <textarea
            {...register("experience")}
            placeholder="Work Experience"
            className="w-full p-2 border"
            rows={3}
          />
          <textarea
            {...register("skills")}
            placeholder="Skills (comma separated)"
            className="w-full p-2 border"
            rows={2}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Preview Resume
          </button>
        </form>
      )}

      {formData && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            ref={resumeRef}
            className="p-6 border shadow-sm bg-white text-black"
          >
            <h1 className="text-2xl font-bold mb-2">{formData.name}</h1>
            <p>{formData.email} | {formData.phone}</p>
            <hr className="my-2" />

            {formData.summary && (
              <>
                <h2 className="font-semibold mt-2">Professional Summary</h2>
                <p>{formData.summary}</p>
              </>
            )}

            {formData.education && (
              <>
                <h2 className="font-semibold mt-2">Education</h2>
                <p>{formData.education}</p>
              </>
            )}

            {formData.experience && (
              <>
                <h2 className="font-semibold mt-2">Experience</h2>
                <p>{formData.experience}</p>
              </>
            )}

            {formData.skills && (
              <>
                <h2 className="font-semibold mt-2">Skills</h2>
                <p>{formData.skills}</p>
              </>
            )}
          </div>

          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Download PDF
          </button>
          <button
            onClick={() => setFormData(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded ml-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
