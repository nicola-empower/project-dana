import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { text, type } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        console.log("Analyzing with Gemini... Key Present:", !!process.env.GEMINI_API_KEY, "Length:", process.env.GEMINI_API_KEY?.length);

        // Models: Try 2.5 Pro as requested, backup to 1.5 Pro
        let modelName = "gemini-2.5-pro";
        let model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
        Role: You are an expert legal assistant specializing in Scottish Family Law and the Domestic Abuse (Scotland) Act 2018.
        Context: A victim of domestic abuse is logging an incident or concern. They may be emotional, scattered, or using non-legal language.
        Task: Analyze the user's input and provide a structured JSON response.

        Input: "${text}"
        Type: ${type || "General Incident"}

        Requirements:
        1. legalSummary: Rewrite the incident using neutral, factual, and legally precise language suitable for a Sheriff or Police Report. Focus on "Course of Conduct", specific behaviors, and impact. Avoid emotional embellishment but clearly state the harm.
        2. validation: A supportive, empathetic message for the user. Validate their feelings, affirm that the behavior described is concerning (if it is), and offer a grounding thought. This is for THEIR eyes only to help them feel heard.
        3. tags: Identify 3-5 relevant legal tags based on Scottish Law (e.g., Coercive Control, Financial Abuse, Isolation, Reckless Conduct, Abusive Behaviour).
        4. category: The single most fitting category from: [Coercive Control, Financial Abuse, Physical Abuse, Sexual Abuse, Stalking, Threats, Emotional Abuse, Isolation, Tech Abuse, Property Damage, Substance Abuse, Legal Bullying, Child Welfare].

        Output Format (JSON Only):
        {
            "legalSummary": "string",
            "validation": "string",
            "tags": ["string", "string"],
            "category": "string"
        }
        `;

        let result;
        try {
            console.log(`Attempting generation with ${modelName}...`);
            result = await model.generateContent(prompt);
        } catch (e: any) {
            console.error(`Error with ${modelName}:`, e.status, e.statusText || e.message);

            // Fallback to gemini-1.5-pro for 404s (model not found) or 503s (overloaded)
            if (e.status === 404 || e.status === 503) {
                console.log("Fallback to gemini-1.5-pro...");
                modelName = "gemini-1.5-pro";
                model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(prompt);
            } else {
                throw e; // Rethrow other critical errors
            }
        }

        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();

        try {
            const data = JSON.parse(jsonText);
            return NextResponse.json(data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw AI Output:", jsonText);
            return NextResponse.json({
                legalSummary: "Could not generate structured description. Please review manually.",
                validation: "We hear you. Please save this log as is.",
                tags: ["Review Needed"],
                category: "Uncategorized"
            });
        }

    } catch (error: any) {
        console.error("Gemini API Fatal Error:", error);
        return NextResponse.json({ error: "Failed to analyze text", details: error.message }, { status: 500 });
    }
}
