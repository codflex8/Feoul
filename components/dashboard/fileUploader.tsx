"use client";

// import { convertFileToUrl } from '@/lib/utils';
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa6";

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (file: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="col-span-2 text-12-regular flex cursor-pointer  flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dark-500 bg-white p-5"
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <FaUpload className="!w-8 !h-8 text-green-500" />
          <div className="flex flex-col justify-center gap-2 text-center text-dark-600">
            <p className="leading-[18px] font-normal">
              <span className="text-green-500 inline-block mx-2">
                إضغط للإرفاق{" "}
              </span>
              أو سحب وإفلات هنا
            </p>
            <p className="text-sm font-semibold">
              SVG, PNG, JPG or Gif (max 800x400)
            </p>
          </div>
        </>
      )}
    </div>
  );
};
export default FileUploader;
