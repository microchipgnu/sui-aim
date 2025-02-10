import { createAimConfig } from "@/lib/aim";
import { RenderableTreeNode, renderers } from "@aim-sdk/core";
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const content = body.content;

        const aimDoc = createAimConfig(content);

        // Create a TransformStream for streaming
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        
        // Start processing in the background
        (async () => {
            try {
                const encoder = new TextEncoder();
                
                for await (const chunk of aimDoc.executeWithGenerator({ input: body.inputs })) {
                    console.log(chunk);
                    // Convert chunk to HTML and send it
                    const html = renderers.html([chunk] as RenderableTreeNode[]);
                    await writer.write(encoder.encode(html));
                }
            } catch (error) {
                console.error('Streaming Error:', error);
            } finally {
                await writer.close();
            }
        })();

        // Return the readable stream
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Transfer-Encoding': 'chunked'
            }
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}