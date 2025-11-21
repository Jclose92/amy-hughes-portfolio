import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    console.log('=== Contact Form API Called ===')
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY)
    console.log('CONTACT_RECIPIENT_EMAIL present:', !!process.env.CONTACT_RECIPIENT_EMAIL)
    console.log('CONTACT_RECIPIENT_EMAIL value:', process.env.CONTACT_RECIPIENT_EMAIL)
    
    // Check if API key is present
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { error: 'Email service not configured - Missing API key' },
        { status: 500 }
      )
    }

    // Check if contact recipient email is configured
    if (!process.env.CONTACT_RECIPIENT_EMAIL) {
      console.error('CONTACT_RECIPIENT_EMAIL is not set')
      return NextResponse.json(
        { error: 'Contact recipient not configured - Missing recipient email' },
        { status: 500 }
      )
    }

    const { name, email, note } = await request.json()
    console.log('Form data received:', { name, email, noteLength: note?.length })

    // Validate required fields
    if (!name || !email || !note) {
      console.error('Missing required fields:', { name: !!name, email: !!email, note: !!note })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send email using Resend
    console.log('Attempting to send email via Resend...')
    console.log('From: Amy Hughes Portfolio <onboarding@resend.dev>')
    console.log('To:', process.env.CONTACT_RECIPIENT_EMAIL)
    console.log('Reply-To:', email)
    
    const { data, error } = await resend.emails.send({
      from: 'Amy Hughes Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: email,
      subject: `New message from ${name} - Portfolio Contact Form`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${note.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      console.error('Resend API error:', JSON.stringify(error, null, 2))
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message || 'Unknown error' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully!')
    console.log('Resend response data:', data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('=== Contact form error ===')
    console.error('Error type:', typeof error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error object:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
