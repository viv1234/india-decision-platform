package com.indiadecision.platform.service.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AiApiClient {

    @Value("${ai.api.key:demo-key}")
    private String apiKey;

    @Value("${ai.api.provider:anthropic}")
    private String provider;

    @Value("${ai.api.model:claude-3-haiku-20240307}")
    private String modelName;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String generateRagResponse(String userQuery, List<RagKnowledgeDocument> contextDocs, String recommendedCalculatorName) {
        String contextText = contextDocs.stream()
                .map(d -> String.format("[%s | %s]: %s", d.getTitle(), d.getSourceRule(), d.getContent()))
                .collect(Collectors.joining("\n"));

        String activeKey = getEffectiveApiKey();

        // If a valid Anthropic / LLM API key is present, execute live HTTP API request
        if (activeKey != null && activeKey.length() > 10) {
            try {
                String liveResponse = callAnthropicApi(userQuery, contextText, recommendedCalculatorName, activeKey);
                if (liveResponse != null && !liveResponse.isBlank()) {
                    return liveResponse;
                }
            } catch (Exception e) {
                // Log and fallback to local RAG knowledge synthesis
                System.err.println("Anthropic API call notice: " + e.getMessage());
            }
        }

        // Resilient RAG Local Knowledge Synthesis Fallback
        StringBuilder ragSynthesis = new StringBuilder();
        ragSynthesis.append(String.format("Goal Parsed: '%s'. ", userQuery));

        if (!contextDocs.isEmpty()) {
            RagKnowledgeDocument primaryDoc = contextDocs.get(0);
            ragSynthesis.append(String.format("RAG Retrieved Rule (%s): %s. ",
                    primaryDoc.getTitle(), primaryDoc.getContent()));
        }

        ragSynthesis.append(String.format("Recommended Calculator: %s.", recommendedCalculatorName));
        return ragSynthesis.toString();
    }

    private String getEffectiveApiKey() {
        if (apiKey != null && !apiKey.isBlank() && !apiKey.equals("demo-key")) {
            return apiKey.trim();
        }
        String envKey = System.getenv("ANTHROPIC_API_KEY");
        if (envKey != null && !envKey.isBlank()) {
            return envKey.trim();
        }
        String aiEnvKey = System.getenv("AI_API_KEY");
        if (aiEnvKey != null && !aiEnvKey.isBlank()) {
            return aiEnvKey.trim();
        }
        return null;
    }

    private String callAnthropicApi(String userQuery, String contextText, String calculatorName, String keyToUse) throws Exception {
        String systemPrompt = "You are BharatDecision AI Assistant, an expert Indian personal finance and decision advisor. Provide concise, clear advice (2-3 sentences max) based on the retrieved context guidelines and recommend using the specified calculator.";
        
        String userContent = String.format("User Query: %s\n\nRetrieved Guidelines Context:\n%s\n\nRecommended Tool: %s",
                userQuery, contextText, calculatorName);

        // Escape JSON special characters
        String escapedSystem = escapeJson(systemPrompt);
        String escapedUser = escapeJson(userContent);

        String jsonPayload = String.format(
                "{" +
                "\"model\":\"%s\"," +
                "\"max_tokens\":350," +
                "\"system\":\"%s\"," +
                "\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}]" +
                "}",
                modelName, escapedSystem, escapedUser
        );

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.anthropic.com/v1/messages"))
                .header("x-api-key", keyToUse.trim())
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .timeout(Duration.ofSeconds(12))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (httpResponse.statusCode() == 200) {
            String body = httpResponse.body();
            int textIdx = body.indexOf("\"text\":\"");
            if (textIdx != -1) {
                int start = textIdx + 8;
                int end = body.indexOf("\"", start);
                if (end != -1) {
                    String text = body.substring(start, end);
                    return unescapeJson(text);
                }
            }
            return body;
        } else {
            System.err.println("Anthropic API Error HTTP Status: " + httpResponse.statusCode() + " Body: " + httpResponse.body());
        }
        return null;
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    private String unescapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\n", "\n")
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\");
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getProvider() {
        return provider;
    }
}
