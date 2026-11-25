package com.agrifarm.modules.media.controller;

import com.agrifarm.common.response.ApiResponse;
import com.agrifarm.modules.media.model.MediaHistory;
import com.agrifarm.modules.media.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final SupabaseStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaHistory>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") UUID entityId
    ) throws IOException {
        MediaHistory saved = storageService.uploadMedia(file, entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success("Media uploaded to Supabase Storage", saved));
    }

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<List<MediaHistory>>> list(
            @PathVariable String entityType,
            @PathVariable UUID entityId
    ) {
        return ResponseEntity.ok(ApiResponse.success("Media history retrieved", storageService.listMedia(entityType, entityId)));
    }
}
