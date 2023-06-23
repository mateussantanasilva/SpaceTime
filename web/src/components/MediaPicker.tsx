'use client' // send js to browser

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

export default function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) throw new Error('No file selected')

    const previewUrl = URL.createObjectURL(files[0])
    setPreview(previewUrl)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        accept="image/*"
        id="media"
        className="invisible h-0 w-0"
        required
      />

      {preview && ( // if then
        <Image
          src={preview}
          alt="Preview da imagem selecionada"
          className="aspect-video w-full rounded-lg object-cover"
          width={40}
          height={40}
        ></Image>
      )}
    </>
  )
}
