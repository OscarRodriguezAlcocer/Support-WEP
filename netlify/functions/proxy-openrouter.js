const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Solo permitir peticiones POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { model, messages } = JSON.parse(event.body);
        const apiKey = process.env.OPENROUTER_API_KEY;

        // *** IMPORTANTE: Revisa este log en Netlify para verificar la clave de API ***
        console.log('API Key length:', apiKey ? apiKey.length : 'undefined');

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: 'API key no está configurada en el servidor. Por favor, configúrala en las variables de entorno de Netlify.' }) };
        }

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model, messages })
        });

        // Intenta parsear la respuesta de OpenRouter. Si falla, usa el texto plano.
        let openRouterData;
        try {
            openRouterData = await openRouterResponse.json();
        } catch (e) {
            // Si la respuesta no es JSON, obtenemos el texto para el error
            openRouterData = { message: await openRouterResponse.text() || 'Respuesta no JSON o vacía de OpenRouter.' };
        }

        if (!openRouterResponse.ok) {
            // Si OpenRouter devolvió un error (status 4xx o 5xx)
            return { 
                statusCode: openRouterResponse.status, 
                body: JSON.stringify({ error: `Error de OpenRouter: ${openRouterData.message || JSON.stringify(openRouterData)}` })
            };
        }

        // Si todo fue bien, devuelve la respuesta de OpenRouter
        return {
            statusCode: 200,
            body: JSON.stringify(openRouterData)
        };

    } catch (error) {
        // Captura errores en el parsing del body, en el fetch, o en el parsing de JSON de OpenRouter
        console.error('Error en la función Netlify (proxy-openrouter):', error);
        return { statusCode: 500, body: JSON.stringify({ error: `Error interno del servidor: ${error.message}` }) };
    }
};