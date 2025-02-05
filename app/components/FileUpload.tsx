/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { IKUpload } from "imagekitio-next";
import { useState } from "react";
//import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";


interface FileUploadProps{
    onSuccess:(res:IKUploadResponse)=>void
    onProgress?:(progress:number)=>void
    fileType?:"image" |"video"
}


export default function FileUpload({
    onSuccess,
    onProgress,
    fileType="image"
}:FileUploadProps) {

    const [uploading,setUploading]=useState(false)
    const [error,setError]=useState<string | null>(null)


    const onError = (err:{message:string}) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    };
    
    const handleSuccess = (response:IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false)
        setError(null)
        onSuccess(response)
    };

    const handleProgress=(evt:ProgressEvent)=>{
        if(evt.lengthComputable && onProgress){
            const percentComplete=(evt.loaded/evt.total)*100;
            onProgress(Math.round(percentComplete));
        }
    };

    const handleUploadStart=()=>{
        setUploading(true);
        setError(null);
    }

        const validateFile=(file:File)=>{
            if(fileType=="video"){
                if(!fileType.startsWith("video/")){
                    setError("Please upload video file")
                    return false
                }
                if(file.size>100*1024*1024){
                    setError("video must be less than 100mb")
                    return false
                }
            }else{
                const validTypes=["image/jpeg","image/png","image/webp"]
                if(!validTypes.includes(file.type)){
                    setError("please upload a valid file(jpeg,png,webp)")
                    return false
                }
                if(file.size>5*1024*1024){
                    setError("image must be less than 5mb")
                    return false
                }
            }
            return false
        }

    return (
        <div className="space-y-2">
        
            <IKUpload
            fileName={fileType==="video"?"video":"image"}
            
            useUniqueFileName={true}
            validateFile={validateFile}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadProgress={handleProgress}
            onUploadStart={handleUploadStart}
            folder={fileType==="video"?"/videos":"/images"}
            />
            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4"/>
                        <span>Uploading...</span>
                    </div>
                )
            }
            {error && (
                <div className="text-error text-sm">{error}</div>
            )}
        </div>
        );
    }