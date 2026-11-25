package com.agrifarm.modules.media.service;

import com.agrifarm.modules.farm.service.FarmService;
import com.agrifarm.modules.media.model.MediaHistory;
import com.agrifarm.modules.media.repository.MediaHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.UUID;

/**
 * Uploads media objects to Supabase Storage (agrifarm-media bucket)
 * and persists signed URL references in PostgreSQL media_history.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    private final MediaHistoryRepository mediaHistoryRepository;
    private final FarmService farmService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${SUPABASE_URL:}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY:}")
    private String supabaseServiceKey;

    @Value("${SUPABASE_STORAGE_BUCKET:agrifarm-media}")
    private String bucketName;

    @Transactional
    public MediaHistory uploadMedia(MultipartFile file, String entityType, UUID entityId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        UUID userId = farmService.requireCurrentUserId();
        String safeFileName = (file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.bin")
                .replaceAll("[^a-zA-Z0-9._-]", "_");
        String objectPath = userId + "/" + entityType.toLowerCase() + "/" + entityId + "/" + System.currentTimeMillis() + "_" + safeFileName;
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        String signedUrl = uploadAndSign(objectPath, file.getBytes(), contentType);

        MediaHistory history = MediaHistory.builder()
                .userId(userId)
                .entityType(entityType.trim().toUpperCase())
                .entityId(entityId)
                .bucketName(bucketName)
                .objectPath(objectPath)
                .signedUrl(signedUrl)
                .contentType(contentType)
                .fileSizeBytes(file.getSize())
                .build();
        return mediaHistoryRepository.save(history);
    }

    public List<MediaHistory> listMedia(String entityType, UUID entityId) {
        UUID userId = farmService.requireCurrentUserId();
        return mediaHistoryRepository.findAllByUserIdAndEntityTypeAndEntityIdOrderByCreatedAtDesc(
                userId, entityType.trim().toUpperCase(), entityId
        );
    }

    private String uploadAndSign(String objectPath, byte[] bytes, String contentType) {
        if (supabaseUrl == null || supabaseUrl.isBlank() || supabaseServiceKey == null || supabaseServiceKey.isBlank()) {
            log.warn("SUPABASE_URL or SUPABASE_SERVICE_KEY not set; recording objectPath metadata without remote upload.");
            return "supabase://" + bucketName + "/" + objectPath;
        }
        try {
            String baseUrl = supabaseUrl.endsWith("/") ? supabaseUrl.substring(0, supabaseUrl.length() - 1) : supabaseUrl;
            HttpRequest uploadReq = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/storage/v1/object/" + bucketName + "/" + objectPath))
                    .header("Authorization", "Bearer " + supabaseServiceKey)
                    .header("apikey", supabaseServiceKey)
                    .header("Content-Type", contentType)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(bytes))
                    .build();
            HttpResponse<String> uploadRes = httpClient.send(uploadReq, HttpResponse.BodyHandlers.ofString());
            if (uploadRes.statusCode() < 200 || uploadRes.statusCode() >= 300) {
                throw new IllegalStateException("Supabase Storage upload failed: " + uploadRes.statusCode() + " " + uploadRes.body());
            }

            HttpRequest signReq = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/storage/v1/object/sign/" + bucketName + "/" + objectPath))
                    .header("Authorization", "Bearer " + supabaseServiceKey)
                    .header("apikey", supabaseServiceKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("{\"expiresIn\": 604800}"))
                    .build();
            HttpResponse<String> signRes = httpClient.send(signReq, HttpResponse.BodyHandlers.ofString());
            if (signRes.statusCode() >= 200 && signRes.statusCode() < 300) {
                JsonNode node = objectMapper.readTree(signRes.body());
                String signedPath = node.path("signedURL").asText("");
                return signedPath.startsWith("http") ? signedPath : baseUrl + "/storage/v1" + signedPath;
            }
            return baseUrl + "/storage/v1/object/" + bucketName + "/" + objectPath;
        } catch (Exception e) {
            log.error("Supabase Storage error: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to upload media to Supabase Storage: " + e.getMessage(), e);
        }
    }
}
