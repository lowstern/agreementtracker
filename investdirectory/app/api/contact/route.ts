import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company } = body;

    // Validate required fields
    if (!name || !email || !company) {
      console.error('❌ CONTACT FORM ERROR: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the submission clearly with formatting
    console.log('\n' + '='.repeat(80));
    console.log('📧 NEW CONTACT FORM SUBMISSION');
    console.log('='.repeat(80));
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 Name:      ${name}`);
    console.log(`📧 Email:     ${email}`);
    console.log(`🏢 Company:   ${company}`);
    console.log('='.repeat(80) + '\n');

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Contact form submitted successfully',
        data: { name, email, company }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ CONTACT FORM ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
