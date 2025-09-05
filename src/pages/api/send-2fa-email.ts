import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일이 필요합니다.' });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    
    const response = await fetch(`${apiUrl}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: data.error || '인증코드 전송에 실패했습니다.' 
      });
    }

    console.log(`OTP 코드 전송 요청 - 이메일: ${email}`);

    res.status(200).json({ 
      message: '인증코드가 전송되었습니다.',
      success: true,
      data: data.data
    });
  } catch (error) {
    console.error('OTP 전송 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}