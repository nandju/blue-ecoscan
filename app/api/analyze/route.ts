import { NextRequest, NextResponse } from 'next/server'

// TODO: Move API key to environment variable (.env)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const imageFile =
      formData.get('image') || formData.get('file')

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    const formDataToSend = new FormData()
    formDataToSend.append("file", imageFile)

    const response = await fetch(
      "https://detect.roboflow.com/blue-ecoscan-waste-detection/1?api_key=dhRzVByUb99KnvtNjdP8",
      {
        method: "POST",
        body: formDataToSend,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Roboflow API error:', errorText)
      throw new Error(`Roboflow API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Roboflow Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}