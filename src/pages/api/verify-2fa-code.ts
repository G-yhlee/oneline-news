import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: '이메일과 인증코드가 필요합니다.' });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    
    const response = await fetch(`${apiUrl}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        otp: code.trim() 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: data.error || '인증코드가 올바르지 않습니다.' 
      });
    }

    console.log(`OTP 인증 성공 - 이메일: ${email}, isValid: ${data.data?.isValid}`);

    res.status(200).json({ 
      message: '인증이 완료되었습니다.',
      success: true,
      data: data.data
    });
  } catch (error) {
    console.error('OTP 인증 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}