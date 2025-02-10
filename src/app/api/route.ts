import { createAimConfig } from "@/lib/aim";
import { RenderableTreeNode, renderers } from "@aim-sdk/core";
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 500;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const content = body.content;

        const aimDoc = createAimConfig(content);

        const result = [];
        for await (const chunk of aimDoc.executeWithGenerator({ input: body.inputs })) {
            result.push(chunk);
        }

        const html = renderers.html(result as RenderableTreeNode[]);
        return new Response(html);
        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}