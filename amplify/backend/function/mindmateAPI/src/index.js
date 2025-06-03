const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime({ region: 'us-east-1' });

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { message, mood } = JSON.parse(event.body);
        
        const prompt = `You are MindMate, an empathetic AI companion providing emotional support. 
        The user is feeling ${mood} and said: "${message}"
        Respond with warmth, empathy, and helpful suggestions. Keep responses conversational and supportive.`;

        const params = {
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 300,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        };

        const response = await bedrock.invokeModel(params).promise();
        const responseBody = JSON.parse(response.body.toString());
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                response: responseBody.content[0].text,
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};