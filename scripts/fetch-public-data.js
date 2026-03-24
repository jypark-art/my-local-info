const fs = require('fs');
const path = require('path');

async function fetchPublicData() {
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataApiKey || !geminiApiKey) {
    console.error('필요한 환경변수가 설정되지 않았습니다. (PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY)');
    return;
  }

  const dataFilePath = path.join(__dirname, '../public/data/local-info.json');
  let localData = [];
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (error) {
    console.error('기존 데이터를 읽어오는 중 오류 발생:', error);
    return;
  }

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${publicDataApiKey}`;
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    const items = result.data || [];

    if (items.length === 0) {
      console.log('가져온 데이터가 없습니다.');
      return;
    }

    // 필터링: 성남 -> 경기 -> 전체
    let filteredItems = items.filter(item => 
      (item.서비스명 && item.서비스명.includes('성남')) ||
      (item.서비스목적요약 && item.서비스목적요약.includes('성남')) ||
      (item.지원대상 && item.지원대상.includes('성남')) ||
      (item.소관기관명 && item.소관기관명.includes('성남'))
    );

    if (filteredItems.length === 0) {
      filteredItems = items.filter(item => 
        (item.서비스명 && item.서비스명.includes('경기')) ||
        (item.서비스목적요약 && item.서비스목적요약.includes('경기')) ||
        (item.지원대상 && item.지원대상.includes('경기')) ||
        (item.소관기관명 && item.소관기관명.includes('경기'))
      );
    }

    if (filteredItems.length === 0) {
      filteredItems = items;
    }

    // [2단계] 기존 데이터와 비교하여 새 항목 찾기
    const existingNames = new Set(localData.map(d => d.name));
    const newItems = filteredItems.filter(item => !existingNames.has(item.서비스명));

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다.');
      return;
    }

    // [3단계] Gemini AI로 새 항목 가공 (첫 번째 항목만 사용)
    const targetItem = newItems[0];
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: "unique-string", name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

분석할 데이터:
${JSON.stringify(targetItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패 (${geminiResponse.status}): ${errorText}`);
    }

    const geminiResult = await geminiResponse.json();
    
    if (!geminiResult.candidates || geminiResult.candidates.length === 0) {
      console.error('Gemini 응답에 결과가 없습니다:', JSON.stringify(geminiResult));
      return;
    }

    let gContent = geminiResult.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록 제거
    gContent = gContent.replace(/```json|```/g, '').trim();
    
    const processedItem = JSON.parse(gContent);
    // ID가 중복되지 않도록 처리 (기존 데이터 개수 활용)
    processedItem.id = `auto-${Date.now()}`;

    // [4단계] 기존 데이터에 추가
    localData.push(processedItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(localData, null, 2), 'utf8');

    console.log(`새로운 항목 추가 완료: ${processedItem.name}`);

  } catch (error) {
    console.error('데이터 처리 중 오류 발생:', error);
  }
}

fetchPublicData();
