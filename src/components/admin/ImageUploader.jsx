"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, Pencil, X } from "lucide-react";

export default function ImageUploader({ value, onChange, folder = "fatima-express", previewClassName = "h-28 w-28" }) {
  const restoreBodyScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
  };

  const handleSuccess = (result) => {
    restoreBodyScroll();
    const url = result?.info?.secure_url;
    if (url) onChange(url);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        options={{ folder, multiple: false, sources: ["local", "url", "camera"] }}
        onSuccess={handleSuccess}
        onClose={restoreBodyScroll}
      >
        {({ open }) =>
          value ? (
            <div className={`group relative overflow-hidden rounded-xl border border-slate-200 ${previewClassName}`}>
              <Image src={value} alt="" fill sizes="200px" className="object-cover" />
              <button
                type="button"
                onClick={() => open()}
                className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-transparent transition group-hover:bg-black/50 group-hover:text-white"
              >
                <Pencil size={16} />
                <span className="text-xs font-semibold">Replace</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => open()}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:text-brand-600 ${previewClassName}`}
            >
              <ImagePlus size={20} />
              <span className="text-[10px] font-semibold">Upload</span>
            </button>
          )
        }
      </CldUploadWidget>
    </div>
  );
}
