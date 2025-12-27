import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CharacterActionLog, InteractionLog, SummaryResponseSchema } from "../types";

// Schema definition for Summary
const summarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    day_summary: {
      type: Type.STRING,
      description: "오늘 하루 호텔에서 일어난 일들을 아우르는 2-3문장의 흥미로운 요약.",
    },
  },
  required: ["day_summary"],
};

export const generateDaySummary = async (
  apiKey: string,
  day: number,
  actions: CharacterActionLog[],
  interactions: InteractionLog[],
  events: string[]
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const actionsText = actions.map(a => `- ${a.guestName}(${a.mbti}): ${a.action}`).join("\n");
  const interactionsText = interactions.map(i => `- 상호작용 [${i.participants.join(', ')}]: ${i.scenario}`).join("\n");
  const eventsText = events.map(e => `- 호텔 사건: ${e}`).join("\n");

  const isAnomaly = day >= 4;
  const moodPrompt = isAnomaly 
    ? "4일차부터 호텔에 기이하고 공포스러운 이상현상이 발생하기 시작했습니다. 요약글은 불안하고 미스터리한 호러 분위기를 풍겨야 합니다." 
    : "아직은 평화로운 호텔의 일상입니다. 요약글은 평범하고 고풍스러운 분위기여야 합니다.";

  const prompt = `
    당신은 '호텔 시뮬레이터'의 내레이터입니다.
    현재 ${day}일차입니다. ${moodPrompt}

    오늘 발생한 사건들은 다음과 같습니다:

    [캐릭터 행동]
    ${actionsText}

    [상호작용]
    ${interactionsText}

    [호텔 사건]
    ${eventsText}

    위 사건들을 바탕으로 오늘 하루의 분위기를 잘 나타내는 짧고 매력적인 요약글(한국어)을 작성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as SummaryResponseSchema;
    return data.day_summary;
  } catch (error) {
    console.error("Summary generation failed:", error);
    // Fallback if AI fails
    return isAnomaly 
      ? "호텔의 공기가 무겁게 가라앉았습니다. 투숙객들은 알 수 없는 불안감에 휩싸여 잠을 설쳤습니다."
      : "오늘도 호텔에는 다양한 일들이 있었습니다. 투숙객들은 각자의 방식대로 하루를 보냈습니다.";
  }
};