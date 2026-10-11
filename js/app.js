        // Configuration
        const GROK_API_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
        const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

        let generatedContent = null;
        let projectData = null;

        // Toggle configuration section
        function toggleConfig(element) {
            const content = element.nextElementSibling;
            content.classList.toggle('active');
            const icon = element.querySelector('span');
            icon.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        // Switch tabs
        function switchTab(tabName) {
            // Hide all tabs
            document.getElementById('seoTab').classList.add('hidden');
            document.getElementById('paraphraseTab').classList.add('hidden');

            // Remove active class from all buttons
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName + 'Tab').classList.remove('hidden');

            // Add active class to clicked button
            event.target.classList.add('active');
        }

        // Show message
        function showMessage(text, type = 'info') {
            const container = document.getElementById('messageContainer');
            const message = document.createElement('div');
            message.className = `message ${type}`;
            const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
            message.textContent = emoji + ' ' + text;
            container.innerHTML = '';
            container.appendChild(message);

            if (type === 'success') {
                setTimeout(() => container.innerHTML = '', 5000);
            }
        }

        // Call Grok API
        async function callGrokAPI(prompt) {
            const apiKey = document.getElementById('grokApiKey').value.trim();
            if (!apiKey) {
                showMessage('Please enter Grok API Key', 'error');
                return null;
            }

            try {
                const response = await fetch(GROK_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'grok-2',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 2000
                    })
                });

                if (!response.ok) {
                    throw new Error(`Grok API Error: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                showMessage('Grok API Error: ' + error.message, 'error');
                return null;
            }
        }

        // Call OpenAI API for paraphrasing
        async function callOpenAIAPI(prompt) {
            const apiKey = document.getElementById('openaiApiKey').value.trim();
            if (!apiKey) {
                showMessage('Please enter OpenAI API Key for paraphrasing', 'error');
                return null;
            }

            try {
                const response = await fetch(OPENAI_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 1500
                    })
                });

                if (!response.ok) {
                    throw new Error(`OpenAI API Error: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                showMessage('OpenAI API Error: ' + error.message, 'error');
                return null;
            }
        }

        // Generate SEO content
        async function generateContent() {
            const projectName = document.getElementById('projectName').value.trim();
            const city = document.getElementById('city').value;
            const microMarket = document.getElementById('microMarket').value.trim();
            const projectType = document.getElementById('projectType').value;
            const brandPositioning = document.getElementById('brandPositioning').value.trim();
            const usp = document.getElementById('usp').value.trim();

            if (!all([projectName, city, microMarket, projectType, brandPositioning, usp])) {
                showMessage('Please fill in all required fields', 'error');
                return;
            }

            showMessage('🤖 Generating content with Grok...', 'info');

            projectData = {
                projectName, city, microMarket, projectType, brandPositioning, usp
            };

            const platform = document.getElementById('platformSelect').value;
            const optimization = document.getElementById('optimizationSelect').value;

            const prompt = `Generate SEO content for a real estate project:
Name: ${projectName}
Location: ${city}, ${microMarket}
Type: ${projectType}
Positioning: ${brandPositioning}
USP: ${usp}

For ${platform} with ${optimization} optimization.

Return ONLY a JSON object with optimized content.`;

            const response = await callGrokAPI(prompt);
            if (response) {
                try {
                    const jsonMatch = response.match(/\{[\s\S]*\}/);
                    generatedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: response };
                    displaySEOContent(generatedContent);
                    showMessage('✅ Content generated!', 'success');
                } catch (e) {
                    generatedContent = { content: response };
                    displaySEOContent(generatedContent);
                    showMessage('✅ Content generated!', 'success');
                }
            }
        }

        // Display SEO content
        function displaySEOContent(content) {
            const container = document.getElementById('seoContent');
            container.innerHTML = '';

            if (typeof content === 'object') {
                for (const [key, value] of Object.entries(content)) {
                    const field = document.createElement('div');
                    field.className = 'output-field';

                    const label = document.createElement('div');
                    label.className = 'output-label';
                    label.textContent = key.replace(/_/g, ' ').toUpperCase();

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'output-content';
                    contentDiv.textContent = String(value);

                    field.appendChild(label);
                    field.appendChild(contentDiv);

                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'btn-copy';
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.onclick = () => copyToClipboard(String(value));

                    field.appendChild(copyBtn);
                    container.appendChild(field);
                }
            }
        }

        // Paraphrase content
        async function paraphraseContent() {
            const content = document.getElementById('contentToParaphrase').value.trim();
            const style = document.getElementById('paraphraseStyle').value;

            if (!content) {
                showMessage('Please paste content to paraphrase', 'error');
                return;
            }

            showMessage('✨ Paraphrasing with GPT...', 'info');

            const prompt = `Paraphrase the following content in a ${style} style. Keep the meaning but use different words and structure:

"${content}"

Provide 3 variations. Format as JSON: {"variation_1": "...", "variation_2": "...", "variation_3": "..."}`;

            const response = await callOpenAIAPI(prompt);
            if (response) {
                try {
                    const jsonMatch = response.match(/\{[\s\S]*\}/);
                    const paraphrases = jsonMatch ? JSON.parse(jsonMatch[0]) : { result: response };
                    displayParaphrases(paraphrases);
                    showMessage('✅ Paraphrasing complete!', 'success');
                } catch (e) {
                    displayParaphrases({ result: response });
                    showMessage('✅ Paraphrasing complete!', 'success');
                }
            }
        }

        // Display paraphrases
        function displayParaphrases(paraphrases) {
            const container = document.getElementById('paraphraseContent');
            container.innerHTML = '';

            for (const [key, value] of Object.entries(paraphrases)) {
                const field = document.createElement('div');
                field.className = 'output-field';

                const label = document.createElement('div');
                label.className = 'output-label';
                label.textContent = key.replace(/_/g, ' ').toUpperCase();

                const contentDiv = document.createElement('div');
                contentDiv.className = 'output-content';
                contentDiv.textContent = String(value);

                field.appendChild(label);
                field.appendChild(contentDiv);

                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn-copy';
                copyBtn.textContent = '📋 Copy';
                copyBtn.onclick = () => copyToClipboard(String(value));

                field.appendChild(copyBtn);
                container.appendChild(field);
            }
        }

        // Copy to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showMessage('✅ Copied!', 'success');
            }).catch(() => {
                showMessage('❌ Copy failed', 'error');
            });
        }

        // Clear form
        function clearForm() {
            document.getElementById('projectPrompt').value = '';
            document.getElementById('projectName').value = '';
            document.getElementById('city').value = '';
            document.getElementById('microMarket').value = '';
            document.getElementById('projectType').value = '';
            document.getElementById('brandPositioning').value = '';
            document.getElementById('usp').value = '';
            document.getElementById('seoContent').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✨</div>
                    <div>Fill in project details and click Generate</div>
                </div>
            `;
            generatedContent = null;
            projectData = null;
        }

        // Helper function
        function all(values) {
            return values.every(v => v && v.length > 0);
        }
    
