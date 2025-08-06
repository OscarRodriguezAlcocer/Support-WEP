
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Solo permitir peticiones POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { model, messages } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API key no está configurada en el servidor.' }) };
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model, messages })
        });

        const data = await response.json();

        if (!response.ok) {
            // Reenviar el mensaje de error de OpenRouter
            return { statusCode: response.status, body: JSON.stringify(data) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
