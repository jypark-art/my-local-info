const fs = require('fs');
const path = require('path');

async function generateBlogPost() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error('환경변수 GEMINI_API_KEY가 설정되지 않았습니다.');
    return;
  }

  const dataFilePath = path.join(__dirname, '../public/data/local-info.json');
  let localData = [];
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (error) {
    console.error('데이터 파일을 읽는 도중 오류 발생:', error);
    return;
  }

  if (localData.length === 0) {
    console.log('가져올 데이터가 없습니다.');
    return;
  }

  // [1단계] 최신 데이터 확인
  const lastItem = localData[localData.length - 1];
  const postsDir = path.join(__dirname, '../src/content/posts/');
  
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(postsDir);
  let alreadyExists = false;

  for (const file of existingFiles) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      if (content.includes(`title: ${lastItem.name}`) || content.includes(lastItem.name)) {
        alreadyExists = true;
        break;
      }
    }
  }

  if (alreadyExists) {
    console.log('이미 작성된 글입니다.');
    return;
  }

  // [2단계] Gemini AI로 블로그 글 생성
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(lastItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${new Date().toISOString().split('T')[0]}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API 호출 실패 (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    let textContent = result.candidates[0].content.parts[0].text;

    // FILENAME 추출
    const filenameMatch = textContent.match(/FILENAME:\s*(.+)$/m);
    let filename = '';
    if (filenameMatch) {
      filename = filenameMatch[1].trim() + '.md';
      // 본문에서 FILENAME 줄 제거
      textContent = textContent.replace(/FILENAME:.*$/m, '').trim();
    } else {
      // FILENAME 없을 경우 기본 파일명 생성
      const keyword = lastItem.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 20);
      filename = `${new Date().toISOString().split('T')[0]}-${keyword}.md`;
    }

    // 마크다운 코드 블록 제거 (혹시 포함될 경우)
    textContent = textContent.replace(/```markdown|```/g, '').trim();

    // [3단계] 파일 저장
    const filePath = path.join(postsDir, filename);
    fs.writeFileSync(filePath, textContent, 'utf8');

    console.log(`블로그 글 생성 완료: ${filename}`);

  } catch (error) {
    console.error('블로그 글 생성 중 오류 발생:', error);
  }
}

generateBlogPost();
